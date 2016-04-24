There are many articles [^http://odetocode.com/blogs/scott/archive/2014/02/17/thoughts-on-javascript-generators.aspx] [^http://truffles.me.uk/playing-with-es6-generators-to-make-a-maybe-in-javascript] [^http://devsmash.com/blog/whats-the-big-deal-with-generators] [^http://luisvega.me/understanding-node-generators] [^http://webreflection.blogspot.com/2013/06/on-harmony-javascript-generators.html] [^http://blog.alexmaccaw.com/how-yield-will-transform-node] [^http://tobyho.com/2013/06/16/what-are-generators/] about JavaScript generators. I have read them all and nonetheless I have struggled to understand the execution order and what are the use cases. I have summarized the learning process that got me to understanding ES6 generators.

## Building an Iterator from a Generator

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/ybm22aur/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

<code>generatorFunction</code> variable is assigned a <em>generator function</em>. Generator functions are denoted using <code>function *</code> syntax.</p>

Calling a generator function returns an <em>iterator object</em>.</p>

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/g15f9g1e/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

## Advancing the Generator

<code>next()</code> method is used to advance the execution of the generator body:</p>

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/x9t25kqc/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

<code>next()</code> method returns an object that indicates the progress of the iteration:</p>

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/4mbLfsq9/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

<code>done</code> property indicates that the generator body has been run to the completion.</p>

The generator function is expected to utilize <code>yield</code> keyword. <code>yield</code> suspends execution of a generator and returns control to the iterator.</p>

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/hqjs6x0r/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

When suspended, the generator does not block the event queue:</p>

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/rc1o4h4q/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

## Pass a Value To the Iterator

<code>yield</code> keyword can pass a value back to the iterator:</p>

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/dv0h3nqz/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

Any data type can be yielded, including functions, numbers, arrays and objects.</p>

When the generator is advanced to the completion, the <code>return</code> value is returned.</p>

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/4mohv6qa/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

## Receive a Value From the Iterator

<code>yield</code> keyword can receive a value back from the iterator:</p>

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/ygsertzo/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

There is no <code>yield</code> expression to receive the first value "foo". The value is tossed-away.</p>

## Understanding the Execution Flow

The best way to understand the execution flow of the generators is to play around using a <code>debugger</code>. I have illustrated the example that I have used to wrap my head around the I/O order.</p>

<figure class="image">
    <img src="./generators.gif">
    <figcaption>Animated execution flow of the ES6 generators.</figcaption>
</figure>

## Iterating Using the <code>for...of</code> Statement

The iterator object returned from the generator is compliant with the ["iterable"](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/iterable) protocol. Therefore, you can use the [<code>for...of</code> statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of) to loop through the generator.</p>

<code data-gist-id="d16ceb1b0b664405a63b"></code>
<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/AAA/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

* The iteration will continue as long as <code>done</code> property is <code>false</code>.
* The <code>for..of</code> loop cannot be used in cases where you need to pass in values to the generator steps.
* The <code>for..of</code> loop will throw away the <code>return</code> value.

## Delegating <code>yield</code>

The <code>yield*</code>operator delegates to another generator.</p>

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/dsmqe0r7/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

Delegating a generator to another generator is in effect the same as importing the body of the target generator to the destination generator. For illustration purposes only, the above code unfolds to the following:</p>

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/2hjnkjhL/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

## Throw

In addition to advancing the generator instance using <code>next()</code>, you can <code>throw()</code>. Whatever is thrown will propagate back up into the code of the generator, i.e. it can be handled either within or outside the generator instance:</p>

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/j040qjm7/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

Any data type can be thrown, including functions, numbers, arrays and objects.</p>

## What Problem Do Generators Solve?

In JavaScript, IO operations are generally done as asynchronous operations that require a callback. For the purpose of illustration, I am going to use a made-up service <code>foo</code>:</p>

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/sgedyq6p/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

Multiple asynchronous operations one after another produce nesting that is hard to read.</p>

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/hxacjzr3/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

There are several solutions to address the issue, such as [using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) or generators. Using generators, the above code can be rewritten as such:</p>

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/L6nkd1hm/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

To execute the generator, we need a controller. The controller needs to fulfill the asynchronous requests and return the result back.</p>

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/r3461eok/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

The last step is to curry the asynchronous functions into functions that take a single parameter (the callback). This allows to iterate the generator instance knowing that <code>yield</code> expression is always expecting a singe parameter, the callback that is used to further advance the iteration.</p>

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/672L4d0a/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

The end result is a script without too many levels of nested callbacks and achieved line independence (the code for one operation is no longer tied to the ones that come after it).</p>

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/1mrfg2nf/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

## Error Handling

It is common to handle the error handling for each individual asynchronous operation, e.g.</p>

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/2z8ometa/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

In the following example, I enable the controller to throw an error and use <code>try...catch</code> block to capture all errors.</p>

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/p0hmsbfq/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

Notice that the execution was interrupted before <code>curry(foo, 'c')</code> was called.</p>

## Libraries To Streamline Generator Based Flow-Control

There are several existing libraries that implement a variation of the above controller, as well as offer interoperability with promises, trunks and other techniques.</p>

* https://github.com/jmar777/suspend
* https://github.com/visionmedia/co
* https://github.com/bjouhier/galaxy
* https://github.com/spion/genny
* https://github.com/creationix/gen-run
