The purpose of this article is to introduce the practices that I have adapted over the years of using Node.js and MySQL.

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

It is important to understand the effects of `Promise.promisifyAll`. `Promise.promisifyAll` does not modify existing methods. It creates a new method affixed with `Async` ending, e.g. [`Connection.prototype.query`](https://github.com/felixge/node-mysql/blob/1720920f7afc660d37430c35c7128b20f77735e3/lib/Connection.js#L189) method will remain as it is. A new method `Connection.prototype.queryAsync` is added to the `Connection.prototype`. Invoking `Connection.prototype.queryAsync` will return a promise whose fate is decided by the callback behavior of the `Connection.prototype.query` function.

## Creating a Connection

It is [recommended](https://github.com/felixge/node-mysql/tree/1720920f7afc660d37430c35c7128b20f77735e3#establishing-connections) to establish an explicit connection.

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

Unlike implicit connection, using `connection.connect` allows to catch connection errors early in program execution.

Since we have promisified `Connection.prototype`, we can use `connection.connectAsync` method to handle connection as a promise.

```js
connection
    .connectAsync()
    .then(() => {
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
        .then(() => {
            return connection;
        })
        .disposer(() => {
            return connection.endAsync();
        });
};
```

I have created a helper function `createConnection` that (1) creates a connection using the provided connection object and (2) ends connection upon invocation of [`disposer`](http://bluebirdjs.com/docs/api/disposer.html) method.

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

Fortunately, abstracting connection pooling is in principal the same as abstracting `mysql.createConnection`:

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

## Levering Bluebird API

In these examples, I have used `Bluebird.promisifyAll` to abstract [`mysql`](https://github.com/felixge/node-mysql) API. This means that all promises have access to the [Bluebird API](http://bluebirdjs.com/docs/api-reference.html). Keep that in mind when handling queries, e.g. use [`.spread`](http://bluebirdjs.com/docs/api/spread.html) method to get the first result from the array (`query` result is always an array):

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
