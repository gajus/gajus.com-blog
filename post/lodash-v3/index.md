[Lo-Dash](https://lodash.com/) is a utility library delivering consistency, customization, performance & extras. Version 3 of this library is advertised to be getting a significant performance boost[^https://twitter.com/jdalton/status/541416821622964224] and a whole lot of of new features[^https://github.com/lodash/lodash/wiki/Changelog].

## Added Methods

47 new methods have been added. The official documentation has not been released. I have used the [changelog](https://github.com/lodash/lodash/wiki/Changelog) and the [ES6 branch](https://github.com/lodash/lodash/tree/es6) of Lo-Dash to generate the docs.

## Lazy Evaluation

In contrast to [eager evaluation](http://en.wikipedia.org/wiki/Eager_evaluation), lazy evaluation is an evaluation strategy which delays the evaluation of an expression until it is needed[^http://en.wikipedia.org/wiki/Lazy_evaluation]. Lo-Dash is using [lazy evaluation](http://en.wikipedia.org/wiki/Lazy_evaluation) to optimize the number of cycles needed to perform an operation. When result set sorting is not important and only a subset of the data is needed, this will result in a smaller memory footprint and smaller number of cycles.

### Example

You have a collection of 100,000 products. Each product is described using a price. You need to get 5 products whose price is less than 0.5. There are two functions that are used to derive the product price, `derivePrice1` and `derivePrice2`.

*Eager evaluation* will derive price of each product before proceeding to filter the collection.

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/2pjjrawt/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

*Lazy evaluation* applies both functions to each member of the collection until `filter` and `take` conditions are satisfied.

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/8cjeh9os/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

### Pipeline

Lazy evaluation uses [pipeline](http://en.wikipedia.org/wiki/Pipeline_%28computing%29) to process the intermediate data. Performing operation in a pipeline gets away without creating an array to store the intermediate results. Accessing the array once reduces the overhead, esp. when the data source is large and accessing memory is expensive.

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/4hz0x8py/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

### Deferred Execution

Lazy evaluation does not compute the chain until `.value()` is called (explicitly or implicitly). The benefit is that you can prepare a complex query and delay the execution until the time it is needed.

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/sopq7v56/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

### Summary

In some scenarios, lazy evaluation reduces the footprint of the application and the execution time. [Filip Zawada](https://twitter.com/filip_zawada) introduced lazy evaluation to Lo-Dash. He has written a [blog post](http://filimanjaro.com/blog/2014/introducing-lazy-evaluation/) about lazy evaluation in the context of Lo-Dash.

Lazy evaluation is not a new concept in JavaScript. [lazy.js](http://danieltao.com/lazy.js/) is another utility library that implements lazy evaluation. Nevertheless, lazy evaluation is a nice addition to Lo-Dash that does not affect the API.

## io.js

Lo-Dash is [tested](https://travis-ci.org/lodash/lodash) and works with io.js.[^https://twitter.com/jdalton/status/555302574585155585]

<!--


To write this article, I did a fair bit of stalking [John-David Dalton](https://twitter.com/jdalton/status/525858579429867520)'s Twitter handle and the official [changelog](https://github.com/lodash/lodash/wiki/Changelog).



– https://github.com/lodash/lodash

<blockquote class="twitter-tweet" lang="en"><p>For you speed freaks, Lo-Dash v3 is up to roughly 40% faster than 2.4.1 with support for deferred &amp; lazy evaluation.</p>&mdash; John-David Dalton (@jdalton) <a href="https://twitter.com/jdalton/status/541416821622964224">December 7, 2014</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

## Reduced Size

https://twitter.com/jdalton/status/525858579429867520

<code data-gist-id="3827c94d9768785e138c"></code>

In the above example

<figure class="image">
    <img src="./lodash-naive.gif" style="width: 400px">
    <figcaption>Animated execution flow of the ES6 generators.</figcaption>
</figure>

<figure class="image">
    <img src="./lodash-lazy-evaluation.gif" style="width: 400px">
    <figcaption>Animated execution flow of the ES6 generators.</figcaption>
</figure>

When put put

## Few Dependencies

https://twitter.com/jdalton/status/541376542631145472

## io.js

https://twitter.com/jdalton/status/555302574585155585

Lo-Dash works io.js https://travis-ci.org/lodash/lodash

## Dependencies

https://twitter.com/jdalton/status/554682000632606721

## ES6

https://twitter.com/jdalton/status/541379703169220608

## WeakMaps

https://twitter.com/jdalton/status/541362577050054656

## Video

https://twitter.com/jdalton/status/543216870384365568

## Lazy.js

https://github.com/dtao/lazy.js
-->
