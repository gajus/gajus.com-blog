# Lo-Dash v3 Documentation

lo-Dash v3 documentation generated from source code as described in the [article](http://gajus.com/blog/4/lodash).

## string

### camelCase

https://raw.githubusercontent.com/lodash/lodash/es6/string/camelCase.js
Converts `string` to camel case.
See [Wikipedia](http://en.wikipedia.org/wiki/CamelCase) for more details.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `string` | `string` | The string to convert.|


#### Returns

| Type | Description |
| --- | --- |
| `string` | the camel cased string.|

```js
_.camelCase('Foo Bar');
// => 'fooBar'

_.camelCase('--foo-bar');
// => 'fooBar'

_.camelCase('__foo_bar__');
// => 'fooBar'
```

### capitalize

https://raw.githubusercontent.com/lodash/lodash/es6/string/capitalize.js
Capitalizes the first character of `string`.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `string` | `string` | The string to capitalize.|


#### Returns

| Type | Description |
| --- | --- |
| `string` | the capitalized string.|

```js
_.capitalize('fred');
// => 'Fred'
```

### deburr

https://raw.githubusercontent.com/lodash/lodash/es6/string/deburr.js
Used to match latin-1 supplementary letters (excluding mathematical operators).

### endsWith

https://raw.githubusercontent.com/lodash/lodash/es6/string/endsWith.js
Checks if `string` ends with the given target string.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `string` | `string` | The string to search.|
| `target` | `string` | The string to search for.|
| `position` | `number` | The position to search from.|


#### Returns

| Type | Description |
| --- | --- |
| `boolean` | `true` if `string` ends with `target`, else `false`.|

```js
_.endsWith('abc', 'c');
// => true

_.endsWith('abc', 'b');
// => false

_.endsWith('abc', 'b', 2);
// => true
```

### escapeRegExp

https://raw.githubusercontent.com/lodash/lodash/es6/string/escapeRegExp.js
Used to match `RegExp` special characters.
See this [article on `RegExp` characters](http://www.regular-expressions.info/characters.html#special)
for more details.

### kebabCase

https://raw.githubusercontent.com/lodash/lodash/es6/string/kebabCase.js
Converts `string` to kebab case (a.k.a. spinal case).
See [Wikipedia](http://en.wikipedia.org/wiki/Letter_case#Computers) for
more details.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `string` | `string` | The string to convert.|


#### Returns

| Type | Description |
| --- | --- |
| `string` | the kebab cased string.|

```js
_.kebabCase('Foo Bar');
// => 'foo-bar'

_.kebabCase('fooBar');
// => 'foo-bar'

_.kebabCase('__foo_bar__');
// => 'foo-bar'
```

### pad

https://raw.githubusercontent.com/lodash/lodash/es6/string/pad.js
Native method references.

### padLeft

https://raw.githubusercontent.com/lodash/lodash/es6/string/padLeft.js
Pads `string` on the left side if it is shorter then the given padding
length. The `chars` string may be truncated if the number of padding
characters exceeds the padding length.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `string` | `string` | The string to pad.|
| `length` | `number` | The padding length.|
| `chars` | `string` | The string used as padding.|


#### Returns

| Type | Description |
| --- | --- |
| `string` | the padded string.|

```js
_.padLeft('abc', 6);
// => '   abc'

_.padLeft('abc', 6, '_-');
// => '_-_abc'

_.padLeft('abc', 3);
// => 'abc'
```

### padRight

https://raw.githubusercontent.com/lodash/lodash/es6/string/padRight.js
Pads `string` on the right side if it is shorter then the given padding
length. The `chars` string may be truncated if the number of padding
characters exceeds the padding length.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `string` | `string` | The string to pad.|
| `length` | `number` | The padding length.|
| `chars` | `string` | The string used as padding.|


#### Returns

| Type | Description |
| --- | --- |
| `string` | the padded string.|

```js
_.padRight('abc', 6);
// => 'abc   '

_.padRight('abc', 6, '_-');
// => 'abc_-_'

_.padRight('abc', 3);
// => 'abc'
```

### repeat

https://raw.githubusercontent.com/lodash/lodash/es6/string/repeat.js
Native method references.

### snakeCase

https://raw.githubusercontent.com/lodash/lodash/es6/string/snakeCase.js
Converts `string` to snake case.
See [Wikipedia](http://en.wikipedia.org/wiki/Snake_case) for more details.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `string` | `string` | The string to convert.|


#### Returns

| Type | Description |
| --- | --- |
| `string` | the snake cased string.|

```js
_.snakeCase('Foo Bar');
// => 'foo_bar'

_.snakeCase('--foo-bar');
// => 'foo_bar'

_.snakeCase('fooBar');
// => 'foo_bar'
```

### startsWith

https://raw.githubusercontent.com/lodash/lodash/es6/string/startsWith.js
Checks if `string` starts with the given target string.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `string` | `string` | The string to search.|
| `target` | `string` | The string to search for.|
| `position` | `number` | The position to search from.|


#### Returns

| Type | Description |
| --- | --- |
| `boolean` | `true` if `string` starts with `target`, else `false`.|

```js
_.startsWith('abc', 'a');
// => true

_.startsWith('abc', 'b');
// => false

_.startsWith('abc', 'b', 1);
// => true
```

### trim

https://raw.githubusercontent.com/lodash/lodash/es6/string/trim.js
Removes leading and trailing whitespace or specified characters from `string`.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `string` | `string` | The string to trim.|
| `chars` | `string` | The characters to trim.|


#### Returns

| Type | Description |
| --- | --- |
| `string` | the trimmed string.|

```js
_.trim('  abc  ');
// => 'abc'

_.trim('-_-abc-_-', '_-');
// => 'abc'

_.map(['  foo  ', '  bar  '], _.trim);
// => ['foo', 'bar]
```

### trimLeft

https://raw.githubusercontent.com/lodash/lodash/es6/string/trimLeft.js
Removes leading whitespace or specified characters from `string`.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `string` | `string` | The string to trim.|
| `chars` | `string` | The characters to trim.|


#### Returns

| Type | Description |
| --- | --- |
| `string` | the trimmed string.|

```js
_.trimLeft('  abc  ');
// => 'abc  '

_.trimLeft('-_-abc-_-', '_-');
// => 'abc-_-'
```

### trimRight

https://raw.githubusercontent.com/lodash/lodash/es6/string/trimRight.js
Removes trailing whitespace or specified characters from `string`.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `string` | `string` | The string to trim.|
| `chars` | `string` | The characters to trim.|


#### Returns

| Type | Description |
| --- | --- |
| `string` | the trimmed string.|

```js
_.trimRight('  abc  ');
// => '  abc'

_.trimRight('-_-abc-_-', '_-');
// => '-_-abc'
```

### trunc

https://raw.githubusercontent.com/lodash/lodash/es6/string/trunc.js
Used as default options for `_.trunc`.

### words

https://raw.githubusercontent.com/lodash/lodash/es6/string/words.js
Used to match words to create compound words.

## array

### chunk

https://raw.githubusercontent.com/lodash/lodash/es6/array/chunk.js
Native method references.

### dropRight

https://raw.githubusercontent.com/lodash/lodash/es6/array/dropRight.js
Creates a slice of `array` with `n` elements dropped from the end.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `array` | `Array` | The array to query.|
| `n` | `number` | The number of elements to drop.|


#### Returns

| Type | Description |
| --- | --- |
| `Array` | the slice of `array`.|

```js
_.dropRight([1, 2, 3]);
// => [1, 2]

_.dropRight([1, 2, 3], 2);
// => [1]

_.dropRight([1, 2, 3], 5);
// => []

_.dropRight([1, 2, 3], 0);
// => [1, 2, 3]
```

### dropRightWhile

https://raw.githubusercontent.com/lodash/lodash/es6/array/dropRightWhile.js
Creates a slice of `array` excluding elements dropped from the end.
Elements are dropped until `predicate` returns falsey. The predicate is
bound to `thisArg` and invoked with three arguments; (value, index, array).

If a property name is provided for `predicate` the created "_.property"
style callback returns the property value of the given element.

If an object is provided for `predicate` the created "_.matches" style
callback returns `true` for elements that have the properties of the given
object, else `false`.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `array` | `Array` | The array to query.|
| `predicate` | `Function|Object|string` | The function invoked
 per element.|
| `thisArg` | `*` | The `this` binding of `predicate`.|


#### Returns

| Type | Description |
| --- | --- |
| `Array` | the slice of `array`.|

```js
_.dropRightWhile([1, 2, 3], function(n) { return n > 1; });
// => [1]

var users = [
  { 'user': 'barney',  'status': 'busy', 'active': false },
  { 'user': 'fred',    'status': 'busy', 'active': true },
  { 'user': 'pebbles', 'status': 'away', 'active': true }
];

// using the "_.property" callback shorthand
_.pluck(_.dropRightWhile(users, 'active'), 'user');
// => ['barney']

// using the "_.matches" callback shorthand
_.pluck(_.dropRightWhile(users, { 'status': 'away' }), 'user');
// => ['barney', 'fred']
```

### dropWhile

https://raw.githubusercontent.com/lodash/lodash/es6/array/dropWhile.js
Creates a slice of `array` excluding elements dropped from the beginning.
Elements are dropped until `predicate` returns falsey. The predicate is
bound to `thisArg` and invoked with three arguments; (value, index, array).

If a property name is provided for `predicate` the created "_.property"
style callback returns the property value of the given element.

If an object is provided for `predicate` the created "_.matches" style
callback returns `true` for elements that have the properties of the given
object, else `false`.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `array` | `Array` | The array to query.|
| `predicate` | `Function|Object|string` | The function invoked
 per element.|
| `thisArg` | `*` | The `this` binding of `predicate`.|


#### Returns

| Type | Description |
| --- | --- |
| `Array` | the slice of `array`.|

```js
_.dropWhile([1, 2, 3], function(n) { return n < 3; });
// => [3]

var users = [
  { 'user': 'barney',  'status': 'busy', 'active': true },
  { 'user': 'fred',    'status': 'busy', 'active': false },
  { 'user': 'pebbles', 'status': 'away', 'active': true }
];

// using the "_.property" callback shorthand
_.pluck(_.dropWhile(users, 'active'), 'user');
// => ['fred', 'pebbles']

// using the "_.matches" callback shorthand
_.pluck(_.dropWhile(users, { 'status': 'busy' }), 'user');
// => ['pebbles']
```

### flattenDeep

https://raw.githubusercontent.com/lodash/lodash/es6/array/flattenDeep.js
Recursively flattens a nested array.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `array` | `Array` | The array to recursively flatten.|


#### Returns

| Type | Description |
| --- | --- |
| `Array` | the new flattened array.|

```js
_.flattenDeep([1, [2], [3, [[4]]]]);
// => [1, 2, 3, 4];
```

### pullAt

https://raw.githubusercontent.com/lodash/lodash/es6/array/pullAt.js
Removes elements from `array` corresponding to the given indexes and returns
an array of the removed elements. Indexes may be specified as an array of
indexes or as individual arguments.

**Note:** Unlike `_.at`, this method mutates `array`.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `array` | `Array` | The array to modify.|
| `indexes` | `...(number|number[])` | The indexes of elements to remove,
 specified as individual indexes or arrays of indexes.|


#### Returns

| Type | Description |
| --- | --- |
| `Array` | the new array of removed elements.|

```js
var array = [5, 10, 15, 20];
var evens = _.pullAt(array, [1, 3]);

console.log(array);
// => [5, 15]

console.log(evens);
// => [10, 20]
```

### slice

https://raw.githubusercontent.com/lodash/lodash/es6/array/slice.js
Creates a slice of `array` from `start` up to, but not including, `end`.

**Note:** This function is used instead of `Array#slice` to support node
lists in IE < 9 and to ensure dense arrays are returned.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `array` | `Array` | The array to slice.|
| `start` | `number` | The start position.|
| `end` | `number` | The end position.|


#### Returns

| Type | Description |
| --- | --- |
| `Array` | the slice of `array`.|


### sortedLastIndex

https://raw.githubusercontent.com/lodash/lodash/es6/array/sortedLastIndex.js
This method is like `_.sortedIndex` except that it returns the highest
index at which `value` should be inserted into `array` in order to
maintain its sort order.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `array` | `Array` | The sorted array to inspect.|
| `value` | `*` | The value to evaluate.|
| `iteratee` | `Function|Object|string` | The function invoked
 per iteration. If a property name or object is provided it is used to
 create a "_.property" or "_.matches" style callback respectively.|
| `thisArg` | `*` | The `this` binding of `iteratee`.|


#### Returns

| Type | Description |
| --- | --- |
| `number` | the index at which `value` should be inserted
 into `array`.|

```js
_.sortedLastIndex([4, 4, 5, 5, 6, 6], 5);
// => 4
```

### takeRight

https://raw.githubusercontent.com/lodash/lodash/es6/array/takeRight.js
Creates a slice of `array` with `n` elements taken from the end.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `array` | `Array` | The array to query.|
| `n` | `number` | The number of elements to take.|


#### Returns

| Type | Description |
| --- | --- |
| `Array` | the slice of `array`.|

```js
_.takeRight([1, 2, 3]);
// => [3]

_.takeRight([1, 2, 3], 2);
// => [2, 3]

_.takeRight([1, 2, 3], 5);
// => [1, 2, 3]

_.takeRight([1, 2, 3], 0);
// => []
```

### takeRightWhile

https://raw.githubusercontent.com/lodash/lodash/es6/array/takeRightWhile.js
Creates a slice of `array` with elements taken from the end. Elements are
taken until `predicate` returns falsey. The predicate is bound to `thisArg`
and invoked with three arguments; (value, index, array).

If a property name is provided for `predicate` the created "_.property"
style callback returns the property value of the given element.

If an object is provided for `predicate` the created "_.matches" style
callback returns `true` for elements that have the properties of the given
object, else `false`.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `array` | `Array` | The array to query.|
| `predicate` | `Function|Object|string` | The function invoked
 per element.|
| `thisArg` | `*` | The `this` binding of `predicate`.|


#### Returns

| Type | Description |
| --- | --- |
| `Array` | the slice of `array`.|

```js
_.takeRightWhile([1, 2, 3], function(n) { return n > 1; });
// => [2, 3]

var users = [
  { 'user': 'barney',  'status': 'busy', 'active': false },
  { 'user': 'fred',    'status': 'busy', 'active': true },
  { 'user': 'pebbles', 'status': 'away', 'active': true }
];

// using the "_.property" callback shorthand
_.pluck(_.takeRightWhile(users, 'active'), 'user');
// => ['fred', 'pebbles']

// using the "_.matches" callback shorthand
_.pluck(_.takeRightWhile(users, { 'status': 'away' }), 'user');
// => ['pebbles']
```

### takeWhile

https://raw.githubusercontent.com/lodash/lodash/es6/array/takeWhile.js
Creates a slice of `array` with elements taken from the beginning. Elements
are taken until `predicate` returns falsey. The predicate is bound to
`thisArg` and invoked with three arguments; (value, index, array).

If a property name is provided for `predicate` the created "_.property"
style callback returns the property value of the given element.

If an object is provided for `predicate` the created "_.matches" style
callback returns `true` for elements that have the properties of the given
object, else `false`.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `array` | `Array` | The array to query.|
| `predicate` | `Function|Object|string` | The function invoked
 per element.|
| `thisArg` | `*` | The `this` binding of `predicate`.|


#### Returns

| Type | Description |
| --- | --- |
| `Array` | the slice of `array`.|

```js
_.takeWhile([1, 2, 3], function(n) { return n < 3; });
// => [1, 2]

var users = [
  { 'user': 'barney',  'status': 'busy', 'active': true },
  { 'user': 'fred',    'status': 'busy', 'active': false },
  { 'user': 'pebbles', 'status': 'away', 'active': true }
];

// using the "_.property" callback shorthand
_.pluck(_.takeWhile(users, 'active'), 'user');
// => ['barney']

// using the "_.matches" callback shorthand
_.pluck(_.takeWhile(users, { 'status': 'busy' }), 'user');
// => ['barney', 'fred']
```

## function

### ary

https://raw.githubusercontent.com/lodash/lodash/es6/function/ary.js
Used to compose bitmasks for wrapper metadata.

### before

https://raw.githubusercontent.com/lodash/lodash/es6/function/before.js
Used as the `TypeError` message for "Functions" methods.

### curryRight

https://raw.githubusercontent.com/lodash/lodash/es6/function/curryRight.js
Used to compose bitmasks for wrapper metadata.

### flow

https://raw.githubusercontent.com/lodash/lodash/es6/function/flow.js
Used as the `TypeError` message for "Functions" methods.

### negate

https://raw.githubusercontent.com/lodash/lodash/es6/function/negate.js
Used as the `TypeError` message for "Functions" methods.

### rearg

https://raw.githubusercontent.com/lodash/lodash/es6/function/rearg.js
Used to compose bitmasks for wrapper metadata.

## lang

### isError

https://raw.githubusercontent.com/lodash/lodash/es6/lang/isError.js
`Object#toString` result references.

### isMatch

https://raw.githubusercontent.com/lodash/lodash/es6/lang/isMatch.js
Used for native method references.

### isNative

https://raw.githubusercontent.com/lodash/lodash/es6/lang/isNative.js
`Object#toString` result references.

### isTypedArray

https://raw.githubusercontent.com/lodash/lodash/es6/lang/isTypedArray.js
`Object#toString` result references.

### toPlainObject

https://raw.githubusercontent.com/lodash/lodash/es6/lang/toPlainObject.js
Converts `value` to a plain object flattening inherited enumerable
properties of `value` to own properties of the plain object.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `value` | `*` | The value to convert.|


#### Returns

| Type | Description |
| --- | --- |
| `Object` | the converted plain object.|

```js
function Foo() {
  this.b = 2;
}

Foo.prototype.c = 3;

_.assign({ 'a': 1 }, new Foo);
// => { 'a': 1, 'b': 2 }

_.assign({ 'a': 1 }, _.toPlainObject(new Foo));
// => { 'a': 1, 'b': 2, 'c': 3 }
```

## utility

### attempt

https://raw.githubusercontent.com/lodash/lodash/es6/utility/attempt.js
Attempts to invoke `func`, returning either the result or the caught
error object.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `func` | `*` | The function to attempt.|


#### Returns

| Type | Description |
| --- | --- |
| `*` | the `func` result or error object.|

```js
// avoid throwing errors for invalid selectors
var elements = _.attempt(function() {
  return document.querySelectorAll(selector);
});

if (_.isError(elements)) {
  elements = [];
}
```

### matches

https://raw.githubusercontent.com/lodash/lodash/es6/utility/matches.js
Creates a function which performs a deep comparison between a given object
and `source`, returning `true` if the given object has equivalent property
values, else `false`.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `source` | `Object` | The object of property values to match.|


#### Returns

| Type | Description |
| --- | --- |
| `Function` | the new function.|

```js
var users = [
  { 'user': 'fred',   'age': 40 },
  { 'user': 'barney', 'age': 36 }
];

var matchesAge = _.matches({ 'age': 36 });

_.filter(users, matchesAge);
// => [{ 'user': 'barney', 'age': 36 }]

_.find(users, matchesAge);
// => { 'user': 'barney', 'age': 36 }
```

### propertyOf

https://raw.githubusercontent.com/lodash/lodash/es6/utility/propertyOf.js
The inverse of `_.property`; this method creates a function which returns
the property value of a given key on `object`.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `object` | `Object` | The object to inspect.|


#### Returns

| Type | Description |
| --- | --- |
| `Function` | the new function.|

```js
var object = { 'user': 'fred', 'age': 40, 'active': true };
_.map(['active', 'user'], _.propertyOf(object));
// => [true, 'fred']

var object = { 'a': 3, 'b': 1, 'c': 2 };
_.sortBy(['a', 'b', 'c'], _.propertyOf(object));
// => ['b', 'c', 'a']
```

## collection

### partition

https://raw.githubusercontent.com/lodash/lodash/es6/collection/partition.js
Creates an array of elements split into two groups, the first of which
contains elements `predicate` returns truthy for, while the second of which
contains elements `predicate` returns falsey for. The predicate is bound
to `thisArg` and invoked with three arguments; (value, index|key, collection).

If a property name is provided for `predicate` the created "_.property"
style callback returns the property value of the given element.

If an object is provided for `predicate` the created "_.matches" style
callback returns `true` for elements that have the properties of the given
object, else `false`.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `collection` | `Array|Object|string` | The collection to iterate over.|
| `predicate` | `Function|Object|string` | The function invoked
 per iteration. If a property name or object is provided it is used to
 create a "_.property" or "_.matches" style callback respectively.|
| `thisArg` | `*` | The `this` binding of `predicate`.|


#### Returns

| Type | Description |
| --- | --- |
| `Array` | the array of grouped elements.|

```js
_.partition([1, 2, 3], function(n) { return n % 2; });
// => [[1, 3], [2]]

_.partition([1.2, 2.3, 3.4], function(n) { return this.floor(n) % 2; }, Math);
// => [[1, 3], [2]]

var users = [
  { 'user': 'barney',  'age': 36, 'active': false },
  { 'user': 'fred',    'age': 40, 'active': true },
  { 'user': 'pebbles', 'age': 1,  'active': false }
];

// using the "_.matches" callback shorthand
_.map(_.partition(users, { 'age': 1 }), function(array) { return _.pluck(array, 'user'); });
// => [['pebbles'], ['barney', 'fred']]

// using the "_.property" callback shorthand
_.map(_.partition(users, 'active'), function(array) { return _.pluck(array, 'user'); });
// => [['fred'], ['barney', 'pebbles']]
```

### sortByAll

https://raw.githubusercontent.com/lodash/lodash/es6/collection/sortByAll.js
This method is like `_.sortBy` except that it sorts by property names
instead of an iteratee function.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `collection` | `Array|Object|string` | The collection to iterate over.|
| `props` | `...(string|string[])` | The property names to sort by,
 specified as individual property names or arrays of property names.|


#### Returns

| Type | Description |
| --- | --- |
| `Array` | the new sorted array.|

```js
var users = [
  { 'user': 'barney', 'age': 36 },
  { 'user': 'fred',   'age': 40 },
  { 'user': 'barney', 'age': 26 },
  { 'user': 'fred',   'age': 30 }
];

_.map(_.sortByAll(users, ['user', 'age']), _.values);
// => [['barney', 26], ['barney', 36], ['fred', 30], ['fred', 40]]
```

## object

### keysIn

https://raw.githubusercontent.com/lodash/lodash/es6/object/keysIn.js
Used for native method references.

### valuesIn

https://raw.githubusercontent.com/lodash/lodash/es6/object/valuesIn.js
Creates an array of the own and inherited enumerable property values
of `object`.

**Note:** Non-object values are coerced to objects.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `object` | `Object` | The object to query.|


#### Returns

| Type | Description |
| --- | --- |
| `Array` | the array of property values.|

```js
function Foo() {
  this.a = 1;
  this.b = 2;
}

Foo.prototype.c = 3;

_.valuesIn(new Foo);
// => [1, 2, 3] (iteration order is not guaranteed)
```

## chain

### thru

https://raw.githubusercontent.com/lodash/lodash/es6/chain/thru.js
This method is like `_.tap` except that it returns the result of `interceptor`.

#### Parameters

| Name | Type | Description |
| --- | --- | --- |
| `value` | `*` | The value to provide to `interceptor`.|
| `interceptor` | `Function` | The function to invoke.|
| `thisArg` | `*` | The `this` binding of `interceptor`.|


#### Returns

| Type | Description |
| --- | --- |
| `*` | the result of `interceptor`.|

```js
_([1, 2, 3])
 .last()
 .thru(function(value) { return [value]; })
 .value();
// => [3]
```

