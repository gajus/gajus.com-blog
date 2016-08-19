Facebook [DataLoader](https://github.com/facebook/dataloader) is a generic utility used to abstract request batching and caching.

I promise you – this thing is magic.

I have discovered DataLoader as part of my research to solve N+1 problem arising when using GraphQL. DataLoader is referred to as a solution to reduce the number of round-trips. However, I have read the documentation and it wasn't immediately clear what it does or how it works; at first sight, it appeared to be a simple key-value cache storage with a getter function.

In this post I illustrate how DataLoader achieves request batching.

First of all, lets create an example of the N+1 problem.

## N+1 problem

The N+1 problem arises when you have a data collection and each child of that collection owns another collection, e.g. a list of posts and each post has a list of tags.

A naive object-relational mapping (ORM) implementation will first fetch the posts and then will make a query for each post to get the tags. Using an example of MySQL, that would result in 5 queries:

```sql
mysql> SELECT * FROM `post`;
+----+------+
| id | name |
+----+------+
|  1 | huhu |
|  2 | lala |
|  3 | keke |
|  4 | koko |
+----+------+
4 rows in set (0.00 sec)

mysql> SELECT `tag`.*, `post_tag`.`post_id` FROM `post_tag` INNER JOIN `tag` ON `tag`.`id` = `post_tag`.`tag_id` WHERE `post_tag`.`post_id` = 1;
+----+------+---------+
| id | name | post_id |
+----+------+---------+
|  1 | toto |       1 |
|  2 | titi |       1 |
+----+------+---------+
2 rows in set (0.00 sec)

mysql> SELECT `tag`.*, `post_tag`.`post_id` FROM `post_tag` INNER JOIN `tag` ON `tag`.`id` = `post_tag`.`tag_id` WHERE `post_tag`.`post_id` = 2;
+----+------+---------+
| id | name | post_id |
+----+------+---------+
|  1 | toto |       2 |
|  1 | toto |       2 |
+----+------+---------+
2 rows in set (0.00 sec)

mysql> SELECT `tag`.*, `post_tag`.`post_id` FROM `post_tag` INNER JOIN `tag` ON `tag`.`id` = `post_tag`.`tag_id` WHERE `post_tag`.`post_id` = 3;
+----+------+---------+
| id | name | post_id |
+----+------+---------+
|  4 | tutu |       3 |
+----+------+---------+
1 row in set (0.00 sec)

mysql> SELECT `tag`.*, `post_tag`.`post_id` FROM `post_tag` INNER JOIN `tag` ON `tag`.`id` = `post_tag`.`tag_id` WHERE `post_tag`.`post_id` = 4;
+----+------+---------+
| id | name | post_id |
+----+------+---------+
|  1 | toto |       4 |
|  2 | titi |       4 |
+----+------+---------+
2 rows in set (0.00 sec)
```

## ORMs are smart

A lot of the ORMs optimize queries to fetch collection data. Here is an example using [Bookshelf](http://bookshelfjs.org/) ORM to fetch the data from the previous example:

```js
import createKnex from 'knex';
import createBookshelf from 'bookshelf';

const knex = createKnex({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    database: 'blog'
  }
});

const bookshelf = createBookshelf(knex);

const Post = bookshelf.Model.extend({
  tableName: 'post',
  tags: function () {
    return this.belongsToMany(Tag)
  }
});

const Tag = bookshelf.Model.extend({
  tableName: 'tag'
});

bookshelf
  .Collection
  .extend({
    model: Post
  })
  .forge()
  .fetch({
    withRelated: 'tags'
  });
```

The latter will fetch data using two queries:

```sql
select
  `post`.*
from
  `post`;

select
  `tag`.*,
  `post_tag`.`post_id` as `_pivot_post_id`,
  `post_tag`.`tag_id` as `_pivot_tag_id`
from
  `tag`
inner join
  `post_tag`
on
  `post_tag`.`tag_id` = `tag`.`id`
where
  `post_tag`.`post_id` in (?, ?, ?, ?);
```

The problem arises when you know only the parent node when requesting its dependencies. You will observe this patten in a system where each node is responsible for fetching its own dependencies, e.g. GraphQL.

## GraphQL nested queries

One of the key aspects of [GraphQL](http://graphql.org/) is its ability to nest queries.

To continue with the blog example, lets implement a schema that would enable us to fetch all posts and their tags, i.e. a schema that supports the following query:

```graphql
{
  posts {
    id,
    name,
    tags {
      id,
      name
    }
  }
}
```

The schema implementation:

```js
import {
  graphql,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} from 'graphql';

// For definition of Post and Tag, refer
// to the previous examples in the article.
import {
  Post,
  Tag
} from './models';

const TagType = new GraphQLObjectType({
  name: 'Tag',
  fields: () => {
    return {
      id: {
        type: new GraphQLNonNull(GraphQLID)
      },
      name: {
        type: new GraphQLNonNull(GraphQLString)
      }
    };
  }
});

const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => {
    return {
      id: {
        type: new GraphQLNonNull(GraphQLID)
      },
      name: {
        type: GraphQLString
      },
      tags: {
        type: new GraphQLList(TagType),
        resolve: (post) => {
          return Post
            .forge({
              id: post.id
            })
            .load('tags')
            .call('related', 'tags')
            .call('toJSON');
        }
      }
    };
  }
});

const QueryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    posts: {
      type: new GraphQLList(PostType),
      resolve: (root) => {
        return Post
          .fetchAll()
          .call('toJSON');
      }
    }
  }
});

const schema = new GraphQLSchema({
  query: QueryType
});
```

This example assumes that you have at least minimal knowledge of GraphQL. If you are not familiar with GraphQL, then a simple takeaway is:

* `posts` node implements `resolve` method that fetches data for all `Post` models.
* `post` has a property `tags`. `tags` `resolve` method has access to the data about the post.
* `post` has a property `tags`. `tags` `resolve` method fetches data for all `Tag` models using the post `id` value.

In this example, `tags` method only knows about a single post at the time of being called, i.e. it does not know whether you are fetching information about a single post or many posts. As a result, executing the earlier query will result in N+1 problem, e.g.

```js
const query = `{
  posts {
    id,
    name,
    tags {
      id,
      name
    }
  }
}`;

graphql(schema, query)
```

The latter produces the following queries:

```sql
select `post`.* from `post`;
select `tag`.*, `post_tag`.`post_id` as `_pivot_post_id`, `post_tag`.`tag_id` as `_pivot_tag_id` from `tag` inner join `post_tag` on `post_tag`.`tag_id` = `tag`.`id` where `post_tag`.`post_id` in (1);
select `tag`.*, `post_tag`.`post_id` as `_pivot_post_id`, `post_tag`.`tag_id` as `_pivot_tag_id` from `tag` inner join `post_tag` on `post_tag`.`tag_id` = `tag`.`id` where `post_tag`.`post_id` in (2);
select `tag`.*, `post_tag`.`post_id` as `_pivot_post_id`, `post_tag`.`tag_id` as `_pivot_tag_id` from `tag` inner join `post_tag` on `post_tag`.`tag_id` = `tag`.`id` where `post_tag`.`post_id` in (3);
select `tag`.*, `post_tag`.`post_id` as `_pivot_post_id`, `post_tag`.`tag_id` as `_pivot_tag_id` from `tag` inner join `post_tag` on `post_tag`.`tag_id` = `tag`.`id` where `post_tag`.`post_id` in (4);
```

## Using DataLoader to batch queries

[DataLoader](https://github.com/facebook/dataloader) is used to create a data loader. `DataLoader` is constructed using a batch loading function. A batch loading function accepts an array of keys, and returns a promise which resolves to an array of values.

Use the resulting data loader function to load values. DataLoader will coalesce all individual loads which occur within a single tick of an event loop and then call your batch loading function.

This definition of the DataLoader is taken more or less verbatim from the [documentation](https://github.com/facebook/dataloader#getting-started). It sounds cool, but it didn't make much sense to me.

Lets use DataLoader to fix the N+1 problem in the blog example.

First, I need a function that can load a batch of tags in one query.

```js
const getPostTagsUsingPostId = (postIds) => {
  return Post
    .collection(postIds.map((id) => {
      return {
        id
      };
    }))
    .load('tags')
    .call('toJSON')
    .then((collection) => {
      // Bookshelf 0.10.0 uses Bluebird ^2.9.4.
      // Support for .mapSeries has been added in Bluebird v3.
      return collection.map((post) => {
        return post.tags;
      });
    });
};
```

`getPostTagsUsingPostId` will construct a single query to fetch tags for a list of post IDs, e.g.

```sql
select
  `tag`.*,
  `post_tag`.`post_id` as `_pivot_post_id`,
  `post_tag`.`tag_id` as `_pivot_tag_id`
from
  `tag`
inner join
  `post_tag`
on
  `post_tag`.`tag_id` = `tag`.`id`
where
  `post_tag`.`post_id` in (?)
```

Second, I need to create a data loader function:

```js
import DataLoader from 'dataloader';

const TagByPostIdLoader = new DataLoader(getPostTagsUsingPostId);
```

Finally, I need `PostType` to use the [`.load()`](https://github.com/facebook/dataloader#loadkey) function of the resulting data loader object to resolve data:

```js
const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: () => {
    return {
      id: {
        type: new GraphQLNonNull(GraphQLID)
      },
      name: {
        type: GraphQLString
      },
      tags: {
        type: new GraphQLList(TagType),
        resolve: (post) => {
          return TagByPostIdLoader.load(post.id);
        }
      }
    };
  }
});
```

Now, lets rerun the earlier query:

```js
const query = `{
  posts {
    id,
    name,
    tags {
      id,
      name
    }
  }
}`;

graphql(schema, query)
```

This time, we have fetched the data using just two queries:

```sql
select `post`.* from `post`
select `tag`.*, `post_tag`.`post_id` as `_pivot_post_id`, `post_tag`.`tag_id` as `_pivot_tag_id` from `tag` inner join `post_tag` on `post_tag`.`tag_id` = `tag`.`id` where `post_tag`.`post_id` in (1, 2, 3, 4)
```

### How does it work?

Hopefully, now the earlier description makes more sense:

> DataLoader is used to create a data loader. `DataLoader` is constructed using a batch loading function. A batch loading function accepts an array of keys, and returns a promise which resolves to an array of values.
>
> Use the resulting data loader function to load values. DataLoader will coalesce all individual loads which occur within a single tick of an event loop and then call your batch loading function.

If you are still struggling, I have made an interactive example:

```js
// tonic ^6.0.0
const DataLoader = require('dataloader');

const getPostTagsUsingPostId = (ids) => {
  console.log(ids);

  return Promise.resolve(ids);
};

const TagByPostIdLoader = new DataLoader(getPostTagsUsingPostId);

TagByPostIdLoader.load(1);
TagByPostIdLoader.load(2);
TagByPostIdLoader.load(3);

// Force next-tick
setTimeout(() => {
  TagByPostIdLoader.load(4);
  TagByPostIdLoader.load(5);
  TagByPostIdLoader.load(6);
}, 100);

// Force next-tick
setTimeout(() => {
  TagByPostIdLoader.load(7);
  TagByPostIdLoader.load(8);
  TagByPostIdLoader.load(9);
}, 200);

setTimeout(() => {
  TagByPostIdLoader.load(10);
  TagByPostIdLoader.load(11);
  TagByPostIdLoader.load(12);
}, 200);
```

## To sum up

[DataLoader](https://github.com/facebook/dataloader) allows you to decouple unrelated parts of your application without sacrificing the performance of batch data-loading. While the loader presents an API that loads individual values, all concurrent requests will be coalesced and presented to your batch loading function. This allows your application to safely distribute data fetching requirements throughout your application and maintain minimal outgoing data requests.[^https://github.com/facebook/dataloader/blame/68a2a2e9a347ff2acc35244ae29995ab625b2075/README.md#L88]

I told you – it is magic.

## Further reading

I thoroughly recommend reading the [source code of the DataLoader](https://github.com/facebook/dataloader/blob/master/src/index.js) (less than 300 lines of code). Ignoring the cache logic, the [underlying implementation](https://github.com/facebook/dataloader/blob/68a2a2e9a347ff2acc35244ae29995ab625b2075/src/index.js#L206-L211) is a simple queue that is using [`process.nextTick`](https://nodejs.org/api/process.html#process_process_nexttick_callback_arg) to resolve an array of promises. Yet, it is a genius application.

Finally, know that each `DataLoader` instance represents a unique cache. After being loaded once, the resulting value is cached, eliminating the redundant requests. You can leverage this to create a cache persisting throughout the life-time of the application, or create a new instance per each request. Continue to read about [DataLoader caching](https://github.com/facebook/dataloader#caching) to learn about cache invalidation.
