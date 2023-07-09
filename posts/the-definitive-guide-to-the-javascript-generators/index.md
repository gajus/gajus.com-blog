There are many articles about JavaScript generators: 
- [Thoughts on Javascript Generators](http://odetocode.com/blogs/scott/archive/2014/02/17/thoughts-on-javascript-generators.aspx)
- [Playing with ES6 Generators to Make a Maybe in Javascript](http://truffles.me.uk/playing-with-es6-generators-to-make-a-maybe-in-javascript)
- [What's the Big Deal with Generators?](http://devsmash.com/blog/whats-the-big-deal-with-generators)
- [Understanding Node Generators](http://luisvega.me/understanding-node-generators)
- [On Harmony Javascript Generators](http://webreflection.blogspot.com/2013/06/on-harmony-javascript-generators.html)
- [How Yield Will Transform Node](http://blog.alexmaccaw.com/how-yield-will-transform-node)
- [What are Generators?](http://tobyho.com/2013/06/16/what-are-generators/)

I have read them all and nonetheless I have struggled to understand the execution order and what are the use cases. I have summarized the learning process that got me to understanding ES6 generators.

## Building an Iterator from a Generator

```js
// tonic ^6.0.0
const generatorFunction = function* () {};
const iterator = generatorFunction();

console.log(iterator[Symbol.iterator]);

// function [Symbol.iterator]()
```

`generatorFunction` variable is assigned a <em>generator function</em>. Generator functions are denoted using `function*` syntax.

Calling a generator function returns an <em>iterator object</em>.

```js
// tonic ^6.0.0
const generatorFunction = function* () {
    // This does not get executed.
    console.log('a');
};

console.log(1);
const iterator = generatorFunction();
console.log(2);
 
// 1
// 2
```

## Advancing the Generator

`next()` method is used to advance the execution of the generator body:

```js
// tonic ^6.0.0
const generatorFunction = function* () {
    console.log('a');
};

console.log(1);
const iterator = generatorFunction();
console.log(2);
iterator.next();
console.log(3);
 
// 1
// 2
// a
// 3
```

`next()` method returns an object that indicates the progress of the iteration:

```js
// tonic ^6.0.0
const generatorFunction = function* () {};
const iterator = generatorFunction();
 
console.log(iterator.next());
 
// Object {value: undefined, done: true}
```

`done` property indicates that the generator body has been run to the completion.

The generator function is expected to utilize `yield` keyword. `yield` suspends execution of a generator and returns control to the iterator.

```js
// tonic ^6.0.0
const generatorFunction = function* () {
    yield;
};
const iterator = generatorFunction();
 
console.log(iterator.next());
console.log(iterator.next());
 
// Object {value: undefined, done: false}
// Object {value: undefined, done: true}
```

When suspended, the generator does not block the event queue:

```js
// tonic ^6.0.0
const generatorFunction = function* () {
    var i = 0;
    while (true) {
        yield i++;
    }
};
 
const iterator = generatorFunction();
 
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
console.log(iterator.next());
 
// Object {value: 0, done: false}
// Object {value: 1, done: false}
// Object {value: 2, done: false}
// Object {value: 3, done: false}
// Object {value: 4, done: false}
// Object {value: 5, done: false}
```

## Pass a Value To the Iterator

`yield` keyword can pass a value back to the iterator:

```js
// tonic ^6.0.0
const generatorFunction = function* () {
    yield 'foo';
};

iterator = generatorFunction();
 
console.log(iterator.next());
console.log(iterator.next());
 
// Object {value: "foo", done: false}
// Object {value: undefined, done: true}
```

Any data type can be yielded, including functions, numbers, arrays and objects.

When the generator is advanced to the completion, the `return` value is returned.

```js
// tonic ^6.0.0
const generatorFunction = function* () {
    yield 'foo';
    return 'bar';
};

const iterator = generatorFunction();
 
console.log(iterator.next());
console.log(iterator.next());
 
// Object {value: "foo", done: false}
// Object {value: "bar", done: true}
```

## Receive a Value From the Iterator

`yield` keyword can receive a value back from the iterator:

```js
// tonic ^6.0.0
const generatorFunction = function* () {
    console.log(yield);
};
 
const iterator = generatorFunction();
 
iterator.next('foo');
iterator.next('bar');
 
// bar
```

There is no `yield` expression to receive the first value "foo". The value is tossed-away.

## Understanding the Execution Flow

The best way to understand the execution flow of the generators is to play around using a `debugger`. I have illustrated the example that I have used to wrap my head around the I/O order.

<figure class="image">
    <img src="./generators.gif">
    <figcaption>Animated execution flow of the ES6 generators.</figcaption>
</figure>

## Iterating Using the `for...of` Statement

The iterator object returned from the generator is compliant with the ["iterable"](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/iterable) protocol. Therefore, you can use the [`for...of` statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of) to loop through the generator.

```js
// tonic ^6.0.0
let index;
 
const generatorFunction = function* () {
    yield 1;
    yield 2;
    yield 3;
    return 4;
};

const iterator = generatorFunction();

for (index of iterator) {
    console.log(index);
}

// 1
// 2
// 3
```

* The iteration will continue as long as `done` property is `false`.
* The `for..of` loop cannot be used in cases where you need to pass in values to the generator steps.
* The `for..of` loop will throw away the `return` value.

## Delegating `yield`

The `yield*`operator delegates to another generator.

```js
// tonic ^6.0.0
let index;
 
const foo = function* () {
    yield 'foo';
    yield * bar();
};
 
const bar = function* () {
    yield 'bar';
    yield * baz();
};
 
const baz = function* () {
    yield 'baz';
};
 
for (index of foo()) {
    console.log(index);
}
 
// foo
// bar
// baz
```

Delegating a generator to another generator is in effect the same as importing the body of the target generator to the destination generator. For illustration purposes only, the above code unfolds to the following:

```js
// tonic ^6.0.0
let index;
 
const foo = function* () {
    yield 'foo';
    yield 'bar';
    yield 'baz';
};
 
for (index of foo()) {
    console.log(index);
}
 
// foo
// bar
// baz
```

## Throw

In addition to advancing the generator instance using `next()`, you can `throw()`. Whatever is thrown will propagate back up into the code of the generator, i.e. it can be handled either within or outside the generator instance:

```js
// tonic ^6.0.0
const generatorFunction = function* () {
    while (true) {
        try {
            yield;
        } catch (e) {
            if (e != 'a') {
                throw e;
            }
            console.log('Generator caught', e);
        }
    }
};
 
const iterator = generatorFunction();
 
iterator.next();
 
try {
    iterator.throw('a');
    iterator.throw('b');
} catch (e) {
    console.log('Uncaught', e);
}
 
// Generator caught a
// Uncaught b
```

Any data type can be thrown, including functions, numbers, arrays and objects.

## What Problem Do Generators Solve?

In JavaScript, IO operations are generally done as asynchronous operations that require a callback. For the purpose of illustration, I am going to use a made-up service `foo`:

```js
// tonic ^6.0.0
const foo = (name, callback) => {
    setTimeout(() => {
        callback(name);
    }, 100);
};
```

Multiple asynchronous operations one after another produce nesting that is hard to read.

```js
// tonic ^6.0.0
const foo = (name, callback) => {
    setTimeout(() => {
        callback(name);
    }, 100);
};

foo('a', (a) => {
    foo('b', (b) => {
        foo('c', (c) => {
            console.log(a, b, c);
        });
    });
});
 
// a
// b
// c
```

There are several solutions to address the issue, such as [using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) or generators. Using generators, the above code can be rewritten as such:

```js
// tonic ^6.0.0
(function* () {
    const a = yield curry(foo, 'a');
    const b = yield curry(foo, 'b');
    const c = yield curry(foo, 'c');
 
    console.log(a, b, c);
});
```

To execute the generator, we need a controller. The controller needs to fulfill the asynchronous requests and return the result back.

```js
// tonic ^6.0.0
/**
 * Initiates a generator and iterates through each function supplied
 * via the yield operator.
 * 
 * @param {Function}
 */
const controller = (generator) => {
    const iterator = generator();
 
    const advancer = (response) => {
        // Advance the iterator using the response of an asynchronous callback.
        const state = iterator.next(response);
 
        if (!state.done) {
            // Make the asynchronous function call the advancer.
            state.value(advancer);
        }
    }
 
    advancer();
};
```

The last step is to curry the asynchronous functions into functions that take a single parameter (the callback). This allows to iterate the generator instance knowing that `yield` expression is always expecting a single parameter, the callback that is used to further advance the iteration.

```js
// tonic ^6.0.0
/**
 * Transforms a function that takes multiple arguments into a
 * function that takes just the last argument of the original function.
 *
 * @param {Function}
 * @param {...*}
 */
const curry = (method, ...args) => {
    return (callback) => {
        args.push(callback);

        return method.apply({}, args);
    };
};
```

The end result is a script without too many levels of nested callbacks and achieved line independence (the code for one operation is no longer tied to the ones that come after it).

```js
// tonic ^6.0.0
const foo = (name, callback) => {
    setTimeout(() => {
        callback(name);
    }, 100);
};
 
const curry = (method, ...args) => {
    return (callback) => {
        args.push(callback);
 
        return method.apply({}, args);
    };
};
 
const controller = (generator) => {
    const iterator = generator();
 
    const advancer = (response) => {
        var state;
 
        state = iterator.next(response);
 
        if (!state.done) {
            state.value(advancer);
        }
    }
 
    advancer();
};
 
controller(function* () {
    const a = yield curry(foo, 'a');
    const b = yield curry(foo, 'b');
    const c = yield curry(foo, 'c');
 
    console.log(a, b, c);
});
 
// a
// b
// c
```

## Error Handling

It is common to handle the error handling for each individual asynchronous operation, e.g.

```js
// tonic ^6.0.0
const foo = (name, callback) => {
    callback(null, name);
};

foo('a', (error1, result1) => {
    if (error1) {
        throw new Error(error1);
    }
 
    foo('b', (error2, result2) => {
        if (error2) {
            throw new Error(error2);
        }
 
        foo('c', (error3, result3) => {
            if (error3) {
                throw new Error(error3);
            }
 
            console.log(result1, result2, result3);
        });
    });
});

// a
// b
// c
```

In the following example, I enable the controller to throw an error and use `try...catch` block to capture all errors.

```js
// tonic ^6.0.0
const foo = (parameters, callback) => {
    setTimeout(() => {
        callback(parameters);
    }, 100);
};

const curry = (method, ...args) => {
    return (callback) => {
        args.push(callback);

        return method.apply({}, args);
    };
};

const controller = (generator) => {
    const iterator = generator();

    const advancer = (response) => {
        if (response && response.error) {
            return iterator.throw(response.error);
        }

        const state = iterator.next(response);

        if (!state.done) {
            state.value(advancer);
        }
    }

    advancer();
};

controller(function* () {
    let a,
        b,
        c;

    try {
        a = yield curry(foo, 'a');
        b = yield curry(foo, {error: 'Something went wrong.'});
        c = yield curry(foo, 'c');
    } catch (e) {
        console.log(e);
    }

    console.log(a, b, c);
});

// Something went wrong.
// a undefined undefined

```

Notice that the execution was interrupted before `curry(foo, 'c')` was called.

## Libraries To Streamline Generator Based Flow-Control

There are several existing libraries that implement a variation of the above controller, as well as offer interoperability with promises, trunks and other techniques.

## Further Reading

[Exploring ES6](http://exploringjs.com/) has a chapter about [Generators](http://exploringjs.com/es6/ch_generators.html). [Axel Rauschmayer](https://twitter.com/rauschma) [write up](http://2ality.com/2015/03/es6-generators.html) about generators covers a lot more than I managed to cover in this article. It is a lengthy read, though I thoroughly recommend it.

* https://github.com/jmar777/suspend
* https://github.com/visionmedia/co
* https://github.com/bjouhier/galaxy
* https://github.com/spion/genny
* https://github.com/creationix/gen-run
