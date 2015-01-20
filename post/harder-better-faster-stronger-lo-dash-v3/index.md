[Lo-Dash](https://lodash.com/) is a utility library delivering consistency, customization, performance & extras. It is also one the most dependent upon NPM packages.[^https://www.npmjs.com/browse/depended] After a complete overhaul (over 800 commits since it has been bumped to v3.0.0-pre[^https://github.com/lodash/lodash/commit/1c770a3c66ef317eb6162fa121f6a46c3226d67f]), version 3 boosts [increased performance](#performance-improvements) and a whole lot of [new features](#added-methods).

## Download

The latest NPM package is [2.4.1](https://www.npmjs.com/package/lodash) (2015-01-20). There is no date for the 3.0.0 release. In the mean time, you can download the latest version (3.0.0-pre) from the [GitHub repository](https://github.com/lodash/lodash):

```bash
npm install git+https://github.com/lodash/lodash.git --save
```

For testing purposes, make a fork of [jsfiddle](http://jsfiddle.net/gajus/gjxa4yga/) that is using the latest build from GitHub.

## Breaking Changes

This post focuses on the new features. For breaking changes, refer to the [changelog](https://github.com/lodash/lodash/wiki/Changelog).

## Performance Improvements

* Improved overall performance 25-45%.[^https://github.com/lodash/lodash/wiki/Changelog]
* Method chaining supports [lazy evaluation](#lazy-evaluation).
* Methods with support for [shortcut fusion](#shortcut-fusion):
    * _.drop
    * _.dropRight
    * _.dropRightWhile
    * _.dropWhile
    * _.filter
    * _.first
    * _.initial
    * _.last
    * _.map
    * _.pluck
    * _.reject
    * _.rest
    * _.reverse
    * _.slice
    * _.take
    * _.takeRight
    * _.takeRightWhile
    * _.takeWhile
    * _.where
* Other optimized methods:
    * _.bind
    * _.clone
    * _.cloneDeep
    * _.compact
    * _.compose
    * _.contains
    * _.difference
    * _.escape
    * _.flatten
    * _.invoke
    * _.isEqual
    * _.isObject
    * _.matches
    * _.max
    * _.min
    * _.partial
    * _.shuffle
    * _.unescape
    * _.uniq
    * _.without
    * _.zip

## Custom Builds

The official [changelog](https://github.com/lodash/lodash-cli/wiki/Changelog) have not been updated. Until that day, I have summarized the findings[^https://github.com/lodash/grunt-lodash/issues/15]:

* Allows `lodash modularize exports=es6` builds.
* Dropped support for `underscore` builds.
* Has singular category names like "array" instead of "arrays".

## ES6

There is a [ES6 branch](https://github.com/lodash/lodash/tree/es6) of Lo-Dash v3. It is using [ES6 modules](http://jsmodules.io/), Set & WeakMap, supports cloning typed arrays & aligns many methods to ES6.[^https://twitter.com/jdalton/status/541379703169220608]

## io.js

Lo-Dash is [tested](https://travis-ci.org/lodash/lodash) and works with io.js.[^https://twitter.com/jdalton/status/555302574585155585]

## Lazy Evaluation

In contrast to [eager evaluation](http://en.wikipedia.org/wiki/Eager_evaluation), lazy evaluation is an evaluation strategy which delays the evaluation of an expression until it is needed[^http://en.wikipedia.org/wiki/Lazy_evaluation]. Lo-Dash is using [lazy evaluation](http://en.wikipedia.org/wiki/Lazy_evaluation) to optimize the number of cycles needed to perform an operation. When result set sorting is not important and only a subset of the data is needed, this will result in a smaller memory footprint and smaller number of cycles.

### Example

You have a collection of 100,000 products. Each product is described using a price. You need to get 5 products whose price is less than 0.5. There are two functions that are used to derive the product price, `derivePrice1` and `derivePrice2`.

*Eager evaluation* will derive price of each product before proceeding to filter the collection.

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/2pjjrawt/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

*Lazy evaluation* applies both functions to each member of the collection until `filter` and `take` conditions are satisfied.

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/8cjeh9os/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

### Shortcut Fusion

Lazy evaluation uses [pipeline](http://en.wikipedia.org/wiki/Pipeline_%28computing%29) to process the intermediate data. Performing operation in a pipeline gets away without creating an array to store the intermediate results. Accessing the array once reduces the overhead, esp. when the data source is large and accessing memory is expensive.

This does not affect Lo-Dash API. However, it is useful to know that your clunky array is handled in a resource efficient manner.

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/4hz0x8py/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

### Deferred Execution

Lazy evaluation does not compute the chain until `.value()` is called (explicitly or implicitly). The benefit is that you can prepare a complex query and delay the execution until the time it is needed.

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/sopq7v56/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

### Summary

In some scenarios, lazy evaluation reduces the footprint of the application and the execution time. [Filip Zawada](https://twitter.com/filip_zawada) introduced lazy evaluation to Lo-Dash. He has written a [blog post](http://filimanjaro.com/blog/2014/introducing-lazy-evaluation/) about lazy evaluation in the context of Lo-Dash.

Lazy evaluation is not a new concept in JavaScript. [lazy.js](http://danieltao.com/lazy.js/) is another utility library that implements lazy evaluation. Nevertheless, lazy evaluation is a nice addition to Lo-Dash that does not affect the API.

## Added Methods

47 new methods have been added.[^https://github.com/lodash/lodash/wiki/Changelog#notable-changes] The official documentation has not been released. I have written a [node script](https://github.com/gajus/blog.gajus.com/tree/master/post/lodash-v3/documentation-generator) that pulls each module from the [ES6 branch](https://github.com/lodash/lodash/tree/es6) and parses the comments to [generate documentation](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md).

### String

| Name | Description |
| --- | --- |
| [`camelCase`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#camelcase)| Converts `string` to camel case. See [Wikipedia](http://en.wikipedia.org/wiki/CamelCase) for more details. |
| [`capitalize`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#capitalize)| Capitalizes the first character of `string`. |
| [`deburr`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#deburr)| Used to match latin-1 supplementary letters (excluding mathematical operators). |
| [`endsWith`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#endswith)| Checks if `string` ends with the given target string. |
| [`escapeRegExp`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#escaperegexp)| Used to match `RegExp` special characters. See this [article on `RegExp` characters](http://www.regular-expressions.info/characters.html#special) for more details. |
| [`kebabCase`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#kebabcase)| Converts `string` to kebab case (a.k.a. spinal case). See [Wikipedia](http://en.wikipedia.org/wiki/Letter_case#Computers) for more details. |
| [`pad`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#pad)| Native method references. |
| [`padLeft`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#padleft)| Pads `string` on the left side if it is shorter then the given padding length. The `chars` string may be truncated if the number of padding characters exceeds the padding length. |
| [`padRight`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#padright)| Pads `string` on the right side if it is shorter then the given padding length. The `chars` string may be truncated if the number of padding characters exceeds the padding length. |
| [`repeat`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#repeat)| Native method references. |
| [`snakeCase`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#snakecase)| Converts `string` to snake case. See [Wikipedia](http://en.wikipedia.org/wiki/Snake_case) for more details. |
| [`startsWith`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#startswith)| Checks if `string` starts with the given target string. |
| [`trim`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#trim)| Removes leading and trailing whitespace or specified characters from `string`. |
| [`trimLeft`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#trimleft)| Removes leading whitespace or specified characters from `string`. |
| [`trimRight`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#trimright)| Removes trailing whitespace or specified characters from `string`. |
| [`trunc`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#trunc)| Used as default options for `_.trunc`. |
| [`words`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#words)| Used to match words to create compound words. |

### Array

| Name | Description |
| --- | --- |
| [`chunk`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#chunk)| Native method references. |
| [`dropRight`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#dropright)| Creates a slice of `array` with `n` elements dropped from the end. |
| [`dropRightWhile`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#droprightwhile)| Creates a slice of `array` excluding elements dropped from the end. Elements are dropped until `predicate` returns falsey. The predicate is bound to `thisArg` and invoked with three arguments; (value, index, array). |
| [`dropWhile`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#dropwhile)| Creates a slice of `array` excluding elements dropped from the beginning. Elements are dropped until `predicate` returns falsey. The predicate is bound to `thisArg` and invoked with three arguments; (value, index, array). |
| [`flattenDeep`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#flattendeep)| Recursively flattens a nested array. |
| [`pullAt`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#pullat)| Removes elements from `array` corresponding to the given indexes and returns an array of the removed elements. Indexes may be specified as an array of indexes or as individual arguments.  **Note:** Unlike `_.at`, this method mutates `array`. |
| [`slice`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#slice)| Creates a slice of `array` from `start` up to, but not including, `end`.  **Note:** This function is used instead of `Array#slice` to support node lists in IE < 9 and to ensure dense arrays are returned. |
| [`sortedLastIndex`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#sortedlastindex)| This method is like `_.sortedIndex` except that it returns the highest index at which `value` should be inserted into `array` in order to maintain its sort order. |
| [`takeRight`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#takeright)| Creates a slice of `array` with `n` elements taken from the end. |
| [`takeRightWhile`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#takerightwhile)| Creates a slice of `array` with elements taken from the end. Elements are taken until `predicate` returns falsey. The predicate is bound to `thisArg` and invoked with three arguments; (value, index, array). |
| [`takeWhile`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#takewhile)| Creates a slice of `array` with elements taken from the beginning. Elements are taken until `predicate` returns falsey. The predicate is bound to `thisArg` and invoked with three arguments; (value, index, array). |

### Function

| Name | Description |
| --- | --- |
| [`ary`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#ary)| Used to compose bitmasks for wrapper metadata. |
| [`before`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#before)| Used as the `TypeError` message for "Functions" methods. |
| [`curryRight`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#curryright)| Used to compose bitmasks for wrapper metadata. |
| [`flow`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#flow)| Used as the `TypeError` message for "Functions" methods. |
| [`negate`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#negate)| Used as the `TypeError` message for "Functions" methods. |
| [`rearg`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#rearg)| Used to compose bitmasks for wrapper metadata. |

### Lang

| Name | Description |
| --- | --- |
| [`isError`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#iserror)| `Object#toString` result references. |
| [`isMatch`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#ismatch)| Used for native method references. |
| [`isNative`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#isnative)| `Object#toString` result references. |
| [`isTypedArray`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#istypedarray)| `Object#toString` result references. |
| [`toPlainObject`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#toplainobject)| Converts `value` to a plain object flattening inherited enumerable properties of `value` to own properties of the plain object. |

### Utility

| Name | Description |
| --- | --- |
| [`attempt`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#attempt)| Attempts to invoke `func`, returning either the result or the caught error object. |
| [`matches`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#matches)| Creates a function which performs a deep comparison between a given object and `source`, returning `true` if the given object has equivalent property values, else `false`. |
| [`propertyOf`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#propertyof)| The inverse of `_.property`; this method creates a function which returns the property value of a given key on `object`. |

### Collection

| Name | Description |
| --- | --- |
| [`partition`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#partition)| Creates an array of elements split into two groups, the first of which contains elements `predicate` returns truthy for, while the second of which contains elements `predicate` returns falsey for. The predicate is bound to `thisArg` and invoked with three arguments; (value, index|key, collection).  |
| [`sortByAll`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#sortbyall)| This method is like `_.sortBy` except that it sorts by property names instead of an iteratee function. |

### Object

| Name | Description |
| --- | --- |
| [`keysIn`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#keysin)| Used for native method references. |
| [`valuesIn`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#valuesin)| Creates an array of the own and inherited enumerable property values of `object`.  **Note:** Non-object values are coerced to objects. |

### Chain

| Name | Description |
| --- | --- |
| [`thru`](https://github.com/gajus/blog.gajus.com/blob/master/post/lodash-v3/documentation.md#thru)| This method is like `_.tap` except that it returns the result of `interceptor`. |

## Summary

Version 3 is the biggest update to Lo-Dash ever[^https://github.com/lodash/lodash/wiki/Changelog]. With ever increasing user base, modular code base, and cross-browser compatibility, Lo-Dash is the go-to utility library for years to come. With that in mind, there is an going competition with [lazy.js](https://github.com/dtao/lazy.js) and [undescore.js](http://underscorejs.org/), both of which are in active development.
