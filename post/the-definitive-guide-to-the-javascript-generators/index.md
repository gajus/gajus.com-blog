There are many articles [^http://odetocode.com/blogs/scott/archive/2014/02/17/thoughts-on-javascript-generators.aspx] [^http://truffles.me.uk/playing-with-es6-generators-to-make-a-maybe-in-javascript] [^http://devsmash.com/blog/whats-the-big-deal-with-generators] [^http://luisvega.me/understanding-node-generators] [^http://webreflection.blogspot.com/2013/06/on-harmony-javascript-generators.html] [^http://blog.alexmaccaw.com/how-yield-will-transform-node] [^http://tobyho.com/2013/06/16/what-are-generators/] about JavaScript generators. I have read them all and nonetheless I have struggled to understand the execution order and what are the use cases. I have summarized the learning process that got me to understanding ES6 generators.

## Building an Iterator from a Generator

<code data-gist-id="59078d3e471c31146d9e"></code>

<code>generatorFunction</code> variable is assigned a <em>generator function</em>. Generator functions are denoted using <code>function *</code> syntax.</p>

Calling a generator function returns an <em>iterator object</em>.</p>

<code data-gist-id="207325138bd1b168fa6e"></code>

## Advancing the Generator

<code>next()</code> method is used to advance the execution of the generator body:</p>

<code data-gist-id="f297aa7504f1f78a72a7"></code>

<code>next()</code> method returns an object that indicates the progress of the iteration:</p>

<code data-gist-id="50630c4f46941486b9fb"></code>

<code>done</code> property indicates that the generator body has been run to the completion.</p>

The generator function is expected to utilize <code>yield</code> keyword. <code>yield</code> suspends execution of a generator and returns control to the iterator.</p>

<code data-gist-id="53be682dbd812f04cb3d"></code>

When suspended, the generator does not block the event queue:</p>

<code data-gist-id="b0c28574702885c86463"></code>

## Pass a Value To the Iterator

<code>yield</code> keyword can pass a value back to the iterator:</p>

<code data-gist-id="e890da30e4f35c0fa520"></code>

Any data type can be yielded, including functions, numbers, arrays and objects.</p>

When the generator is advanced to the completion, the <code>return</code> value is returned.</p>

<code data-gist-id="cf2f35c7846c4431730b"></code>

## Receive a Value From the Iterator

<code>yield</code> keyword can receive a value back from the iterator:</p>

<code data-gist-id="e547c4e1463ee06e9c71"></code>

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

* The iteration will continue as long as <code>done</code> property is <code>false</code>.
* The <code>for..of</code> loop cannot be used in cases where you need to pass in values to the generator steps.
* The <code>for..of</code> loop will throw away the <code>return</code> value.

## Delegating <code>yield</code>

The <code>yield*</code>operator delegates to another generator.</p>

<code data-gist-id="b6e0bfbe2c92153f0aef"></code>

Delegating a generator to another generator is in effect the same as importing the body of the target generator to the destination generator. For illustration purposes only, the above code unfolds to the following:</p>

<code data-gist-id="956a086d53c7be1f2ef5"></code>

## Throw

In addition to advancing the generator instance using <code>next()</code>, you can <code>throw()</code>. Whatever is thrown will propagate back up into the code of the generator, i.e. it can be handled either within or outside the generator instance:</p>

<code data-gist-id="9a2b736fbf1773e11ed7"></code>

Any data type can be thrown, including functions, numbers, arrays and objects.</p>

## What Problem Do Generators Solve?

In JavaScript, IO operations are generally done as asynchronous operations that require a callback. For the purpose of illustration, I am going to use a made-up service <code>foo</code>:</p>

<code data-gist-id="128d8c5d03a729c5a5d7"></code>

Multiple asynchronous operations one after another produce nesting that is hard to read.</p>

<code data-gist-id="e29acea7c19fbfe34e3e"></code>

There are several solutions to address the issue, such as [using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) or generators. Using generators, the above code can be rewritten as such:</p>

<code data-gist-id="8f93418f93bb861a18e7"></code>

To execute the generator, we need a controller. The controller needs to fulfill the asynchronous requests and return the result back.</p>

<code data-gist-id="551cd1989471d85837e8"></code>

The last step is to curry the asynchronous functions into functions that take a single parameter (the callback). This allows to iterate the generator instance knowing that <code>yield</code> expression is always expecting a singe parameter, the callback that is used to further advance the iteration.</p>

<code data-gist-id="99d17383f55f8bd49dab"></code>

The end result is a script without too many levels of nested callbacks and achieved line independence (the code for one operation is no longer tied to the ones that come after it).</p>

<code data-gist-id="89b345cac0fe2ae13986"></code>

## Error Handling

It is common to handle the error handling for each individual asynchronous operation, e.g.</p>

<code data-gist-id="93e39b5717724b82b6aa"></code>

In the following example, I enable the controller to throw an error and use <code>try...catch</code> block to capture all errors.</p>

<code data-gist-id="92a16147195af3c87114"></code>

Notice that the execution was interrupted before <code>curry(foo, 'c')</code> was called.</p>

## Libraries To Streamline Generator Based Flow-Control

There are several existing libraries that implement a variation of the above controller, as well as offer interoperability with promises, trunks and other techniques.</p>

* https://github.com/jmar777/suspend
* https://github.com/visionmedia/co
* https://github.com/bjouhier/galaxy
* https://github.com/spion/genny
* https://github.com/creationix/gen-run