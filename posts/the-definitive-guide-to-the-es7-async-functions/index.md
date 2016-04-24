## Continuation-Passing Style

Most JavaScript code that relies on asynchronous data is written using [continuation-passing style](http://en.wikipedia.org/wiki/Continuation-passing_style), e.g.

<div class='embed'>
    <a class="jsbin-embed" href="http://jsbin.com/nexuqo/embed?js,console"> on jsbin.com</a>
</div>

There are a few things that can help to minimize the so-called callback hell (viz., using named functions over anonymous functions, modularization)[^http://callbackhell.com/]. Nonetheless, sequential iterations remains a PITA.

<div class='embed'>
    <a class="jsbin-embed" href="http://jsbin.com/zezixi/embed?js,console"> on jsbin.com</a>
</div>

### ES6 Promise

We can use [ES6 Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise) to perform sequential iteration.

<div class='embed'>
    <a class="jsbin-embed" href="http://jsbin.com/cuhoda/embed?js,console"> on jsbin.com</a>
</div>

## ES7 `async/await`

If you are comfortable working with ES6 Promise, ES7 `async/await` is the sugar-coated equivalent.




<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/9nf2rjmm/embedded/js/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

`await` keyword expects [ES6 Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise):

* If/when promise is resolved, the return value is the resolved value.
* If/when promise is resolved, the [error thrown](#error-handling) is what been used to reject the promise.

You can use `await` only in `async` function.

## ES7 `await*`

[`await*`](https://github.com/lukehoban/ecmascript-asyncawait#await-and-parallelism) is a syntactic sugar for [`Promise.all`](https://github.com/petkaantonov/bluebird/blob/master/API.md#all---promise).

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/fzf2xmmL/embedded/js/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

## Running ES7 Code

[Async Functions for ECMAScript proposal](https://github.com/lukehoban/ecmascript-asyncawait) was accepted into stage 1 ("Proposal") of the ECMASCript 7 [spec process](https://docs.google.com/document/d/1QbEE0BsO4lvl7NFTn5WXWeiEIBfaVUF7Dk0hpPpPDzU) in January 2014. The spec text can be found [here](http://tc39.github.io/ecmascript-asyncawait/).

You can run `async/await` code using a transpiler (source-to-source compiler). [Babel](https://babeljs.io/) transpiler has the biggest coverage of ES6 and ES7 features.[^http://kangax.github.io/compat-table/es7/]

```sh
npm install babel@5.0.4 -g
babel-node --stage 1 ./your-script.js
```

## Choosing Between ES6 Promise and ES7 `async/await`

`async/await` makes the biggest difference when you have multiple dependencies that need to be fetched asynchronously, e.g. (the requirement is to have all three connections open at once)

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/hmuzrpnv/embedded/js/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

Of course, even the latter can be flattened using Bluebird [.spread()](https://github.com/petkaantonov/bluebird/blob/master/API.md#spreadfunction-fulfilledhandler--function-rejectedhandler----promise):

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/7detnvxL/embedded/js/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

Nonetheless, I prefer `await` keyword:

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/t4p3khf9/embedded/js/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

[add example showing how each/map/then chaining work together with await]

## Error Handling

You must wrap all instances of `await` in a `try...catch` statement.

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/mvsfx6ma/embedded/js/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

The promise that we await for is rejected. Rejection terminates the `async` block but does not propagate to the program. The output of the above program:

```
a
1
b
[Error: Oops #0]
```

Take a moment to observe that `[Error: Oops #0]` comes after `b` and `1` does not. This is because the `async` function is defined as IIFE. To delay

As the code base grows it becomes harder and harder to handle errors within `async` functions.

### Global Error Handler

Remember that beneath the surface, `await` simply handles ES6 [Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise).

You can use [Bluebird](https://github.com/petkaantonov/bluebird) Promise implementation to take advantage of the [global rejection events](https://github.com/petkaantonov/bluebird/blob/master/API.md#global-rejection-events).

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/y4gfu97f/embedded/js/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

## Testing `async/await`

When I started using `async/await` my first test cases were these:

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/2Lw1wv80/embedded/js/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

Remember that beneath the surface, `await` simply handles ES6 [Promise](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise).

You can use your regular testing strategy that you use when testing Promise objects. I use [`chai-as-promised`](https://github.com/domenic/chai-as-promised/):

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/5g9wjv0a/embedded/js/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

My experience was that using Promise directly for testing has prooved to be more reliable then experimental `async/await`.
