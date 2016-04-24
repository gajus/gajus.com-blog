The purpose of this article is to introduce the practices that I have adopted over the years of using Node.js and MySQL.

For all examples, I am using [`mysql`](https://github.com/felixge/node-mysql) package.

## Promisify MySQL

I am using [`Promise.promisifyAll`](http://bluebirdjs.com/docs/api/promise.promisifyall.html) to create an async equivalent of each function declared in a prototype of `mysql/lib/Connection` and `mysql/lib/Pool`.

```js
const mysql = require('mysql');
const Connection = require('mysql/lib/Connection');
const Pool = require('mysql/lib/Pool');
const Promise = require('bluebird');

Promise.promisifyAll([
    Connection,
    Pool
]);
```

`Promise.promisifyAll` does not modify the existing methods. For every method in the target function prototype, `Promise.promisifyAll` creates a new method affixed with `Async` ending, e.g. [`Connection.prototype.query`](https://github.com/felixge/node-mysql/blob/1720920f7afc660d37430c35c7128b20f77735e3/lib/Connection.js#L189) method remains as it is. A new method `Connection.prototype.queryAsync` is added to the `Connection.prototype`. Invoking `Connection.prototype.queryAsync` will return a promise whose fate is decided by the callback behavior of the `Connection.prototype.query` function.

## Creating a Connection

It is [recommended](https://github.com/felixge/node-mysql/tree/1720920f7afc660d37430c35c7128b20f77735e3#establishing-connections) to establish an explicit connection, e.g.

```js
const connection = mysql
    .createConnection({
        host: '127.0.0.1'
    });

connection
    .connect((error) => {
        if (error) {
            console.error('Connection error.', error);

            return;
        }

        console.log('Established connection.', connection.threadId);
    });
```

Unlike implicit connection, using `connection.connect` allows to catch connection errors early in the program execution.

Since we have promisified `Connection.prototype`, we can use `connection.connectAsync` method to handle connection as a promise:

```js
connection
    .connectAsync()
    .then((result) => {
        console.log('Established connection.', connection.threadId);
    })
    .catch((error) => {
        console.error('Connection error.', error);
    });
```

### Creating a Connection for an Operation

If your program does most of the work without involving the database, then it is reasonable to open the database connection only when program logic requires it. The ideal scenario is: open a connection for a series of database tasks and close the connection when all tasks are completed.

Meet [`Promise.using`](http://bluebirdjs.com/docs/api/promise.using.html):

> In conjunction with [`.disposer`](http://bluebirdjs.com/docs/api/disposer.html), `using` will make sure that no matter what, the specified disposer will be called when the promise returned by the callback passed to `using` has settled. The disposer is necessary because there is no standard interface in node for disposing resources.


```js
const createConnection = (connectionOptions) => {
    const connection = mysql.createConnection(connectionOptions);

    return connection
        .connectAsync()
        .then((result) => {
            return connection;
        })
        .disposer(() => {
            return connection.endAsync();
        });
};
```

Keep in mind that `connect` resolves with a value of connection status, e.g. if connection is successful, `result` is equivalent to:

```js
OkPacket {
    fieldCount: 0,
    affectedRows: 0,
    insertId: 0,
    serverStatus: 2,
    warningCount: 0,
    message: '',
    protocol41: true,
    changedRows: 0
}
```

After establishing the connection, use the original `connection` object (constructed using `createConnection`) to make queries.

I have created a helper function `createConnection` that (1) creates a connection using the provided `connectionOptions` object and (2) ends connection upon invocation of [`disposer`](http://bluebirdjs.com/docs/api/disposer.html) method.

This is how you use `createConnection` with `Promise.using`:

```js
Promise
    .using(createConnection({
        host: '127.0.0.1'
    }), (connection) => {
        return Promise
            .all([
                connection.queryAsync('SELECT 1'),
                connection.queryAsync('SELECT 2'),
                connection.queryAsync('SELECT 3'),
            ]);
    });
```

The `disposer` callback is invoked as soon as all 3 queries are executed. All 3 queries share the same connection.

### Creating a Connection Pool

If your program relies on constant connection to the database (e.g. an API endpoint that fetches data from a database), then it is desirable to have a [connection pool](https://en.wikipedia.org/wiki/Connection_pool):

> Connection pools are used to enhance the performance of executing commands on a database. Opening and maintaining a database connection for each user, especially requests made to a dynamic database-driven website application, is costly and wastes resources. In connection pooling, after a connection is created, it is placed in the pool and it is used again so that a new connection does not have to be established. If all the connections are being used, a new connection is made and is added to the pool. Connection pooling also cuts down on the amount of time a user must wait to establish a connection to the database.

Fortunately, abstracting connection pooling is similar to abstracting `mysql.createConnection`:

```js
const pool = mysql
    .createPool({
        host: '127.0.0.1'
    });

const getConnection = (pool) => {
    return pool
        .getConnectionAsync()
        .then((connection) => {
            return connection;
        })
        .disposer((connection) => {
            return connection.releaseAsync();
        });
};
```

Note the subtle differences:

* `connection.releaseAsync` is used instead of `connection.endAsync`.
* `pool.getConnectionAsync` is used instead of `connection.connectAsync`.

This is how you use `getConnection` with `Promise.using`:

```js
Promise
    .using(getConnection(pool), (connection) => {
        return Promise
            .all([
                connection.queryAsync('SELECT 1'),
                connection.queryAsync('SELECT 2'),
                connection.queryAsync('SELECT 3'),
            ]);
    });
```

## Leveraging Bluebird API

In all of the examples, I have used `Bluebird.promisifyAll` to abstract [`mysql`](https://github.com/felixge/node-mysql) API. This means that all promises have access to the [Bluebird API](http://bluebirdjs.com/docs/api-reference.html). Keep that in mind when handling queries, e.g. use [`.spread`](http://bluebirdjs.com/docs/api/spread.html) method to get the first result from the array (`query` result is always an array):

```js
connection
    .query('SELECT 1')
    .spread((id) => {
        assert(id === 1);
    });
```

## Reducing Nesting using Async Functions

In general, promises are great for preventing the [callback hell](http://callbackhell.com/). However, consider an example where you have a series of queries that depend on the result of a previous query:

```js
const getUserByEmail = (connection, userEmail) => {
    return connection
        .queryAsync('SELECT `id` FROM `user` WHERE `email` = ?', [
            userEmail
        ])
        .spread((user) => {
            if (!user) {
                return null;
            }

            return connection
                .queryAsync('SELECT `id`, `name` FROM `permission` WHERE `user_id` = ?', [
                    user.id
                ])
                .then((permissions) => {
                    return {
                        ...user,
                        permissions: permissions
                    }
                });
        });
};
```

Using [Async Functions](https://github.com/tc39/ecmascript-asyncawait) we can flatten the dependency structure using `await` keyword, e.g.

```js
const getUserByEmail = async (connection, userEmail) => {
    const user = await connection
        .queryAsync('SELECT `id` FROM `user` WHERE `email` = ?', [
            userEmail
        ])
        .then(_.head);

    if (!user) {
        return null;
    }

    const permissions = await connection
        .queryAsync('SELECT `id`, `name` FROM `permission` WHERE `user_id` = ?', [
            user.id
        ]);

    return {
        ...user,
        permissions: permissions
    };
};
```

Note: [`_.head`](https://lodash.com/docs#head) is a [lodash](https://lodash.com/) function.

## Named Placeholders

`mysql` module uses `?` characters as placeholders for values, e.g.

```sql
connection
    .query('SELECT ?, ?', [
        'foo',
        'bar'
    ]);
```

This example is equivalent to:

```sql
connection.query('SELECT ' + connection.escape('foo') + ', ' + connection.escape('bar'));
```

However, this approach becomes hard to read as query becomes large and the list of values long.

There is an alternative: named placeholders.

```sql
connection
    .query('SELECT :foo, :bar', {
        foo: 'FOO',
        bar: 'BAR'
    });
```

The latter is equivalent to:

```sql
connection.query('SELECT ' + connection.escape('FOO') + ', ' + connection.escape('BAR'));
```

Placeholder names can appear multiple times, e.g.

```sql
connection
    .query('SELECT :foo, :foo', {
        foo: 'FOO'
    });
```

The latter is equivalent to:

```sql
connection.query('SELECT ' + connection.escape('FOO') + ', ' + connection.escape('FOO'));
```

As of this writing, `mysql` [does not support named parameters](https://github.com/felixge/node-mysql/issues/920).

However, it is easy to patch `Connection.prototype.query` prototype to add the support:

First, you need to install [`named-placeholders`](https://www.npmjs.com/package/named-placeholders) package.

Then, patch the `Connection.prototype.query`:

```js
const toUnnamed = require('named-placeholders')();
const originalQuery = require('mysql/lib/Connection').prototype.query;

require('mysql/lib/Connection').prototype.query = function (...args) {
    if (Array.isArray(args[0]) || !args[1]) {
        return originalQuery.apply(this, args);
    }

    ([
        args[0],
        args[1]
    ] = toUnnamed(args[0], args[1]));

    return originalQuery.apply(this, args);
};
```

That's it. You can now use named placeholders.

## Constructing Queries

There are several problems associated with constructing queries.

### Queries That Span Multiple Lines

The problem with writing queries that span multiple lines is simple: JavaScript does not support strings that span multiple lines. The closest thing to multi-line string support is [template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals). The problem with using a template literal to declare a MySQL query is that their syntaxes are incompatible:

* Template literals are [enclosed by the back-tick (`` ` ``)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals#Syntax) character; and
* MySQL uses the backtick character to [quote the identifiers](http://dev.mysql.com/doc/refman/5.7/en/identifiers.html).

For this reason, I store each query in a dedicated file. The added benefit of having SQL queries in a dedicated file is:

* Makes it easy to track changes in the version control.
* Separates code development from query writing.
* Enforces statically typed queries (prohibits inline conditions).
* You can load SQL queries in a dedicated IDE.

Tip: To use queries defined in a separate file, create a helper function that loads the query and caches the result.

### Dynamic Expressions

First of all, I avoid use of dynamic expressions whenever possible. Reason: when queries are predictable, DBAs can optimize indexes. When you need to query data based on dynamic criteria, consider using a search server (e.g. https://www.elastic.co/).

However, there are cases (e.g. building a prototype product) when you will want to dynamically build queries simply because it is less complex than the alternatives.

In this case, I suggest using a query builder (e.g. [Squel.js](https://hiddentao.github.io/squel)) to build expressions.

Note: I do not recommend building queries using a query builder. A common pro-query builder argument is that abstracting SQL code using a query builder makes it easy to migrate from one database engine to another, e.g. from MySQL to PostgresQL. This might be the case, but you got to ask yourself – how many times in your professional career did you need to migrate a project from one database to another database without rewriting most of the underlying code regardless of whether you were using a query builder/ ORM or not. Probably not that many.

Lets consider a simple example:

```sql
CREATE TABLE `person` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

A database table storing people data. The requirement: user must be able to filter data using any of the `person` defining columns.

Start by writing a query to get all the relevant records:

```sql
SELECT
    `id`,
    `first_name`,
    `last_name`,
    `email`
FROM
    `person`
WHERE
    1 /* expression */
```

`WHERE 1` forces to return all results.

Now lets build an expression using [`squel.expr`](http://hiddentao.github.io/squel/#expressions) to filter only the relevant records:

```js
const squel = require('squel');

const expression = squel.expr();

if (userQuery.firstName) {
    expression.and('`first_name` LIKE ?', userQuery.firstName);
}

if (userQuery.lastName) {
    expression.and('`last_name` LIKE ?', userQuery.lastName);
}

if (userQuery.email) {
    expression.and('`email` LIKE ?', userQuery.email);
}
```

Use `squel.expr().toString()` to convert query object to SQL expression (or an empty string if query is empty). Use `String.prototype.replace` to replace `1 /* expression */` with the generated expression or `1` (`WHERE` clause requires a specifier).

```js
const fs = require('fs');
const selectPersonsQuery = fs.readFileSync('./selectPersonsQuery.sql', 'utf8');

const whereExpression = expression.toString();

const generatedSelectPersonsQuery = selectPersonsQuery.replace('1 /* expression */', whereExpression || 1);

connection.query(generatedSelectPersonsQuery);
```

Done. You have a working query builder.

This approach allows utilization of query builder without sacrificing the readability of the query body.

## Debugging

`mysql` package documentation is a lengthy, monolithic document. As a result, it is not a surprise that the [section about debugging](https://github.com/felixge/node-mysql/tree/1720920f7afc660d37430c35c7128b20f77735e3#debugging-and-reporting-problems) is often overlooked.

Debugging is enabled at the time of configuring the connection, e.g.

```js
mysql
    .createConnection({
        debug: true
    });
```

Enabling debugging will print all outgoing and incoming packets on stdout. You can filter the log by the packet type:

```js
mysql
    .createConnection({
        debug: [
            'ComQueryPacket',
            'RowDataPacket'
        ]
    });
```

This configuration will log only the queries being sent and the result being returned, e.g.

```
--> ComQueryPacket
ComQueryPacket { command: 3, sql: 'SELECT \'A\', \'B\'' }

<-- RowDataPacket
RowDataPacket { A: 'A', B: 'B' }
```

## `mysql2`

[`mysql2`](https://github.com/sidorares/node-mysql2) is an alternative MySQL driver for Node.js. It is [mostly](https://github.com/sidorares/node-mysql2/tree/cd16a0a7ad2d273fa5126135479d4698bd554cea#known-incompatibilities-with-node-mysql) compatible with the `mysql` driver.

Notable differences between `mysql2` and `mysql` are:

* `mysql2` has a considerable performance advantage.
* `mysql2` natively supports named placeholders[^https://github.com/sidorares/node-mysql2#named-placeholders].
* `mysql2` supports true prepared statements[^https://github.com/sidorares/node-mysql2#prepared-statements]. `mysql` implementation imitates[^https://github.com/felixge/node-mysql/tree/1720920f7afc660d37430c35c7128b20f77735e3#escaping-query-values] prepared statements by escaping the values and executing the query with interpolated values.

In my eyes, the only downside to using `mysql2` over `mysql` is its relatively small community:

||`mysql`|`mysql2`|
|---|---|---|
|GitHub Stargazers|6695|284|
|GitHub Forks|1087|57|
|Github Watchers|378|30|
|NPM downloads last month|462,781|11,701|

Last updated: Tue Apr 26 20:53:20 2016.

### Performance

`mysql2` boosts considerable performance improvements over `mysql`. Here is a summary of the [benchmark](https://gist.github.com/sidorares/ffe9ee9c423f763e3b6b) that `mysql2` is using to prove its edge:

* `node-mysql`: peaks 6000 rps, first timeout errors at 110 conns, latency99 60ms at 110 conns
* `node-mysql2`: peak 15000 rps, first timeout errors at 150 conns, latency99 30ms at 150 conn
* `memory`: peak 46000 rps, no erros, latency99 20ms at 300 conns (7ms at 120 conn)
