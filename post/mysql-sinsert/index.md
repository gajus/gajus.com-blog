I am working a lot with data that is identifiable using an external ID (EUID; external unique identifier), stored locally and augmented with additional metadata, e.g.

## Playground

1. Rotten Tomatoes API [`/movies`](http://developer.rottentomatoes.com/docs/read/json/v10/Movie_Info) and the corresponding resource (movie) id is what I am referring to as EUID.
2. `title` is a local representation of the external resource.
3. `title.foo` and `title.bar` is metadata.

<code data-gist-id="b7c0821bceb8fab43e20"></code>

## Requirements

We need to fetch arbitrary records from the external API and augment it with arbitrary metadata.

We need to perform `UPSERT` (update, insert):

1. Find a local record that represents the external resource using EUID.
    1. If record does not exist, insert a record.
2. Update the local record.
3. Return local id.

Returning local id is not part of the `UPSERT` concept.

## Reason for not using EUID as the primary key

EUID can be anything. It can be a string ID (e.g. `2cd05416a2cbb410VgnVCM1000000b43151a____`) or it can be an unnecessary large integer (e.g. Facebook ids go up to 2^32).

1. You want to make your data (and indexes) as small as possible. Shorter indexes are faster, not only because they require less disk space, but because they also give you more hits in the index cache, and thus fewer disk seeks.[^http://dev.mysql.com/doc/refman/5.7/en/data-size.html]
2. If you are working with multiple external data sources, you want to have consistent PK format.

## Solutions

`UPSERT` can be done using `SELECT[, INSERT], UPDATE` or `INSERT ... ON DUPLICATE KEY UPDATE`.

### `SELECT[, INSERT], UPDATE`

> Code examples use ES7 [ecmascript-asyncawait](https://github.com/lukehoban/ecmascript-asyncawait) syntax to perform queries. This is no different from using Promises.

<code data-gist-id="e56b20bd2271d6dcc403"></code>

### `INSERT ... ON DUPLICATE KEY UPDATE`

<code data-gist-id="d4929ca8443c7324516c"></code>

## Shortcomings

### `SELECT[, INSERT], UPDATE`

* Verbose.
* Requires that all other columns have a default value (or be nullable).

### `INSERT ... ON DUPLICATE KEY UPDATE`

* Hard to analyzing query logs (e.g. identifying ratio between found/not found records).
* `ON DUPLICATE KEY UPDATE` will not work when id is an auto-increment column.
* You should try to avoid using an `ON DUPLICATE KEY UPDATE` clause on tables with multiple unique indexes.[^https://dev.mysql.com/doc/refman/5.7/en/insert-on-duplicate.html].

## The solution

With these considerations in mind, I prefer `SELECT[, INSERT], UPDATE` approach.

* Verbosity is an easy problem to abstract.
* Default value/[`NULL` problem](#null-problem) has its advantages.

### `SINSERT`

I wrote a function that abstracts the look up of an existing record using a unique key and inserts the record when it is not found. I am calling it `SINSERT` (`SELECT[, INSERT]`):

<code data-gist-id="4c3cdfd93314a6dd175d"></code>

Using `SINSERT` we can continue to use EUID to retrieve reference to the local representation of the external resource, and use local id to perform business-as-usual `UPDATE` operation.

<code data-gist-id="298994989b8ddcfb9e14"></code>

## `NULL` problem

External resource representation in a local database must include EUID. This is the minimum knowledge required to:

1. Establish existence of the external resource.
2. Create a local representation of the resource.
3. Lookup data about the resource in the future.

All metadata should be nullable to allow creating resource presence representation using the minimum available information. This is important. It enables separation of parsing and writing logic, e.g.

### TV shows, seasons and episodes

You are working with an API that provides information about TV shows, seasons and episodes. You want to store information about an episode in a local database.

You will need `episode` table that describes EUID, metadata and assigns a local resource id. You will have `show` and `season` tables describing the equivalent data. You can further normalise this by creating table `title` that represents the external resource collection.

<code data-gist-id="e254ecf9e867b38a2613"></code>

You have made an API call to retrieve information about a TV episode.

<code data-gist-id="9b4d941b1e233a8f5039"></code>

You want to write this information to the database.

If `show` or `season` tables had non-nullable columns (e.g. show name or season number), you would not be able to insert record about TV episode without first fetching information about the TV show and season (assuming it is not already in the database).

<code data-gist-id="ee8279c1ccbc100dbf0f"></code>

This approach enables you to write data with complex relationships, but requires minimal knowledge about each player. Meta information about each player can be fetched in the future.
