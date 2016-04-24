I am working a lot with data that is identifiable using an external ID (EUID; external unique identifier), stored locally and augmented with additional metadata, e.g.

## Playground

1. Rotten Tomatoes API [`/movies`](http://developer.rottentomatoes.com/docs/read/json/v10/Movie_Info) and the corresponding resource (movie) id is what I am referring to as EUID.
2. `title` is a local representation of the external resource.
3. `title.foo` and `title.bar` is metadata.

```sql
CREATE TABLE `title` (
    `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `euid` int(10) unsigned NOT NULL,
    `foo` varchar(100) DEFAULT NULL,
    `bar` varchar(100) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `rottentomatoes_id` (`rottentomatoes_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

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

```js
let Writer = (db) => {
    let writer = {};

    /**
     * @param {Object} title
     * @param {String} title.id EUID
     * @param {String} title.foo
     * @param {String} title.bar
     * @return {Number} title id
     */
    writer.upsertTitle = async (title) => {
        let titles,
            titleId;

        await db.query('START TRANSACTION');

        titles = await db
            .query('SELECT `id` FROM `title` WHERE `euid` = ? LIMIT 1', [
                title.id
            ]);

        if (titles.length) {
            titleId = titles[0].id;
        } else {
            titleId = await db
                .query('INSERT INTO `title` SET `euid` = ?', [
                    title.id
                ])
                .then((result) => {
                    return result.insertId;
                });
        }

        await db
            .query('UPDATE `title` SET `foo` = ?, `bar` = ? WHERE `id` = ?', [
                title.foo,
                title.bar,
                titleId
            ]);

        await db.query('COMMIT');

        return titleId;
    };

    return writer;
};
```

### `INSERT ... ON DUPLICATE KEY UPDATE`

```js
let Writer = (db) => {
    let writer = {};

    /**
     * @param {Object} title
     * @param {String} title.id EUID
     * @param {String} title.foo
     * @param {String} title.bar
     * @return {Number} title id
     */
    writer.upsertTitle = async (title) => {
        let titles;

        await db
            .query('INSERT INTO `title` SET `euid` = ?, `foo` = ?, `bar` = ? ON DUPLICATE KEY UPDATE `foo` = VALUES(`foo`), `bar` = VALUES(`bar`)', [
                title.id,
                title.foo,
                title.bar
            ]);

        titles = await db
            .query('SELECT `id` FROM `title` WHERE `euid` = ? LIMIT 1', [
                title.id
            ]);

        return titles[0].id;
    };

    return writer;
};
```

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

```js
/**
 * Selects a record using a unique identifier.
 * If record is not found, inserts a record using the unique identifier.
 * Returns id of the inserted record.
 *
 * @param {String} table
 * @param {String} column
 * @param {String|Number} uid
 * @return {Number} id
 */
db.sinsert = async (table, column, uid) => {
    let id;

    await db.query('START TRANSACTION');

    id = db
        .query('SELECT `id` FROM ?? WHERE ?? = ?', [
            table,
            column,
            uid
        ])
        .then((rows) => {
            if (rows.length) {
                return rows[0].id;
            }

            return db
                .query('INSERT INTO ?? SET ?? = ?', [
                    table,
                    column,
                    uid
                ])
                .then((result) => {
                    return result.insertId;
                });
        });

    await db.query('COMMIT');

    return id;
};
```

Using `SINSERT` we can continue to use EUID to retrieve reference to the local representation of the external resource, and use local id to perform business-as-usual `UPDATE` operation.

```js
let Writer = (db) => {
    let writer = {};

    /**
     * @param {Object} title
     * @param {String} title.id EUID
     * @param {String} title.foo
     * @param {String} title.bar
     * @return {Number} title id
     */
    writer.upsertTitle = async (title) => {
        let titleId;

        titleId = await db.sinsert('title', 'euid', title.id);

        await db
            .query('UPDATE `title` SET `foo` = ?, `bar` = ? WHERE `id` = ?', [
                title.foo,
                title.bar,
                titleId
            ]);

        return titleId;
    };

    return writer;
};
```

## `NULL` problem

External resource representation in a local database must include EUID. This is the minimum knowledge required to:

1. Establish existence of the external resource.
2. Create a local representation of the resource.
3. Lookup data about the resource in the future.

All metadata should be nullable to allow creating resource presence representation using the minimum available information. This is important. It enables separation of parsing and writing logic, e.g.

### TV shows, seasons and episodes

You are working with an API that provides information about TV shows, seasons and episodes. You want to store information about an episode in a local database.

You will need `episode` table that describes EUID, metadata and assigns a local resource id. You will have `show` and `season` tables describing the equivalent data. You can further normalise this by creating table `title` that represents the external resource collection.

```sql
CREATE TABLE `title` (
    `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `euid` varchar(255) NOT NULL DEFAULT '',
    PRIMARY KEY (`id`),
    UNIQUE KEY `euid` (`euid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `episode` (
    `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `title_id` int(10) unsigned NOT NULL,
    `season_id` int(10) unsigned DEFAULT NULL,
    `name` varchar(255) DEFAULT NULL,
    `number` int(10) unsigned DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `season_id` (`season_id`,`number`),
    KEY `title_id` (`title_id`),
    CONSTRAINT `episode_ibfk_1` FOREIGN KEY (`title_id`) REFERENCES `title` (`id`) ON DELETE CASCADE,
    CONSTRAINT `episode_ibfk_2` FOREIGN KEY (`season_id`) REFERENCES `season` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `season` (
    `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `title_id` int(10) unsigned NOT NULL,
    `show_id` int(10) unsigned DEFAULT NULL,
    `number` int(10) unsigned DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `title_id` (`title_id`),
    UNIQUE KEY `show_id` (`show_id`,`number`),
    CONSTRAINT `season_ibfk_1` FOREIGN KEY (`title_id`) REFERENCES `title` (`id`) ON DELETE CASCADE,
    CONSTRAINT `season_ibfk_2` FOREIGN KEY (`show_id`) REFERENCES `show` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `show` (
    `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
    `title_id` int(10) unsigned NOT NULL,
    `name` varchar(255) DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `title_id` (`title_id`),
    CONSTRAINT `show_ibfk_1` FOREIGN KEY (`title_id`) REFERENCES `title` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

You have made an API call to retrieve information about a TV episode.

```json
{
    "id": "a9fc6741eb003410VgnVCM1000000b43151a____",
    "type": "episode",
    "name": "The Flamingo",
    "number": 1,
    "show": {
      "id": "ef10b1b8e1e50410VgnVCM1000000b43151a____"
    },
    "season": {
      "id": "46e58fc0fbcd6410VgnVCM1000000b43151a____"
    }
}
```

You want to write this information to the database.

If `show` or `season` tables had non-nullable columns (e.g. show name or season number), you would not be able to insert record about TV episode without first fetching information about the TV show and season (assuming it is not already in the database).

```js
let Writer = (db) => {
    let writer = {};

    /**
     * @param {Object} episode
     * @param {String} episode.id Episode EUID.
     * @param {String} episode.name
     * @param {String} episode.number
     * @param {String} episode.show.id Show EUID.
     * @param {String} episode.season.id Season EUID.
     * @return {Number} episode id
     */
    writer.upsertEpisode = (episode) => {
        let showId = await writer.sinsertShow(episode.show.id),
            seasonId = await writer.sinsertSeason(episode.season.id),
            episodeId = await writer.sinsertEpisode(episode.id);

        // Update.

        return episodeId;
    };

    /**
     * @private
     * @param {String} EUID
     * @return {Number} title id
     */
    writer.sinsertTitle = (EUID) => {
        return db.sinsert('title', 'euid', EUID);
    };

    /**
     * @private
     * @param {String} Show EUID
     * @return {Number} show id
     */
    writer.sinsertShow = async (EUID) => {
        let titleId = await writer.sinsertTitle(EUID);

        return db.sinsert('show', 'title_id', titleId);
    };

    /**
     * @private
     * @param {String} Season EUID
     * @return {Number} season id
     */
    writer.sinsertSeason = async (EUID) => {
        let titleId = await writer.sinsertTitle(EUID);

        return db.sinsert('season', 'title_id', titleId);
    };

    /**
     * @private
     * @param {String} Episode EUID
     * @return {Number} episode id
     */
    writer.sinsertEpisode = async (EUID) => {
        let titleId = await writer.sinsertTitle(EUID);

        return db.sinsert('episode', 'title_id', titleId);
    };

    return writer;
};
```

This approach enables you to write data with complex relationships, but requires minimal knowledge about each player. Meta information about each player can be fetched in the future.
