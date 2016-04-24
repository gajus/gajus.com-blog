This article is a result of extensive research about BDD in JavaScript. I have extracted the core principals and terminology, and provide practical examples that illustrate the benefits of BDD.

## What is BDD?

In the 8th chapter, the author quotes various definitions of BDD. I favor the following:

<figure class="quote">
    <blockquote>
        <p>[BDD] extends TDD by writing test cases in a natural language that non-programmers can read.</p>
    </blockquote>
    <figcaption>M. Manca</figcaption>
</figure>

<figure class="quote">
    <blockquote>
        <p>BDD is a second-generation, outside-in, pull-based, multiple-stakeholder, multiple-scale, high-automation, agile methodology. It describes a cycle of interactions with well-defined outputs, resulting in the delivery of working, tested software that matters.</p>
    </blockquote>
    <figcaption>Dan North</figcaption>
</figure>

Developers pull features from stakeholders and develop them outside-in. The features are pulled in the order of their business value. The most important feature is implemented first and it's implemented outside in. No time is wasted building unnecessary code.

The evolution of a programmer that is learning TDD is a good guidance in understanding the BDD:

1. Most developers start by writing unit tests to existing code.
1. After some practise they learn about the advantages of writing the test first. They might learn about good testing practices like AAA, stubs and factories at this point.
1. They realise that TDD can be used as a design tool to discover the API of the production code.
1. Eventually they recognise that TDD is not about testing. It's about defining behavior and writing specifications that serve as living documentation. They also discover mocks and outside-in development.

## Principles of BDD

### Baby Steps

Characteristic feature of BDD is using "baby steps" to achieve tight feedback loop. In practice, this means writing a single spec knowing that it will fail, writing the missing code logic, returning to the spec. This continues switching between code and test cases results in less scanning of the code.

### Red/Green/Refactor

You want to achieve Red/Green/Refactor routine:

<ul>
   <li>Are all specs green (after the implementation phase)?</li>
   <li>Is <em>one</em> spec red (after coding another spec)?</li>
</ul>

The idea is to ensure that the test really works and can catch an error.

<h3>Triangulation</h3>

Instead of filling in a real implementation, you can fake it with a dummy value.

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/p24zdova/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

You know that your implementation isn't ready, but all the specs are showing green. This implies that there is a spec example missing.

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/b55zpsgL/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

You proceed until you've covered just enough test cases to produce a general solution.

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/ta61xnko/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

The idea is to gain moment and insight into how the algorithm should behave.

### Summary

Behaviour Driven Development is characterized by:

* Spec/Error driven coding.
* Using baby-steps to achieve a "tight feedback-loop".
* Follow the Red-Green-Refactor (RGR) cycle to avoid the false-positives.

The result:

* Software design driven by needs.
* RGR cycle enhances the separation of the workload. Red is for the interface, green is for the implementation.
* Specs enable code refactoring.
* Automated tests that read like documentation. Prefer DAMP over DRY.

<dl>
    <dt>Refactoring</dt>
    <dd>Altering internal code structure without affecting the external behaviour.</dd>

    <dt>DAMP</dt>
    <dd>Descriptive and Meaningful Phrases.</dd>
</dl>

## BDD in Practice

### Using Test Doubles

#### Dummies

Empty object that does nothing.

* Objects are passed around but never actually used. Usually they are just used to fill parameter lists.[^http://martinfowler.com/articles/mocksArentStubs.html]

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/eprp2v5z/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

#### Stubs

Method designed just for testing.

* Stub objects provide a valid response, but it's static – no matter what input you pass in, you'll always get the same response.[^http://stackoverflow.com/a/1830000/368691]
* An object that provides predefined answers to method calls.[^http://stackoverflow.com/a/5180286/368691]
* Stubs provide canned answers to calls made during the test, usually not responding at all to anything outside what's programmed in for the test. Stubs may also record information about calls, such as an email gateway stub that remembers the messages it 'sent', or maybe only how many messages it "sent".[^http://martinfowler.com/articles/mocksArentStubs.html]
* A stub will never cause a test to fail.[^http://ayende.com/Wiki/Rhino+Mocks+3.5.ashx]
* Stub is simple fake object. It just makes sure test runs smoothly.[^http://stackoverflow.com/a/3459431/368691]

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/va65wsqr/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

#### Mocks

Object designed just for testing.

* Mock objects are used in mock test cases – they validate that certain methods are called on those objects.[^http://stackoverflow.com/a/1830000/368691]
* An object on which you set expectations.[^http://stackoverflow.com/a/5180286/368691]

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/tw2pLkcm/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

### Example Factory

Method used to instantiate the SUT object with canonical values, overwriting only the properties relevant to the test case.

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/ugfp6k0s/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

See https://github.com/petejkim/factory-lady, Object Mother and Test Data Builders.

### SEE Pattern

Every spec needs these three parts and nothing more – in this order:

1. Setup, e.g. create an object.
1. Execute, i.e. introduce change to the object state.
1. Expect, i.e. state an expectation of what should have happened.

You might have also heard <dfn>Given, When, Then</dfn> (GWT):

* Given a condition.
* When I do something.
* Then I expect something to happen.

The two are identical. The phrasing of the latter might be easier to comprehend.

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/tbw49r6z/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

As a result, your specs must adhere to the following rules:

* The spec must implement not more than one execution.
* The spec must abstain from several expectations.
* Do not use if-statement that lead to multiple execution and expectation branches – write several specs instead.

In TDD world it is known as the <dfn>Arrange, Act, Assert</dfn> (AAA) pattern.

## Organizing Specs

The specs are organised either per Feature or per Fixture.

### Per Feature

This way of organizing a spec is also referred to as "by topic".

The benefit of organizing your spec per feature makes it easier to write.

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/2f1xvL2g/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

### Per Fixture

This way or organizing a spec is also referred to as "by example data".

The benefit of organizing your spec per fixture makes the resulting spec more descriptive and easier to read. The additional benefit is because all your examples share the same example data, you need to state it only once (e.g. using <code>beforeEach</code> setup function).

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/cnda492j/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

## High and Low Level Spec

BDD project usually starts with writing the outer circle (high level specs) and then proceeding the implementation of the inner circle (low level specs).

### Outside-In Development

You start with the implementation of the specs that have meaning to the business using hypothetical components (aka. acceptance test):

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/snr8pb4e/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

Acceptance test is a high level spec that describes a scenario from the view of an application user. In contrast to the low level spec, a high level spec does not have an SUT.

The upside of the outside-in development is that you never write code that will become redundant (the requirement can be traced back to the spec). The downside is that you cannot run the test cases until the implementation is complete.

* They help to become aware of bugs – all spec violations are considered a bug (defect awareness).
* They are most useful when shown to stakeholders.
* There are usually only a few. they don't include all special cases. their main purpose is to provide an overview of the required functionality.

### Inside-Out Development

You start with the basic components that make up the application:

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/sotuL6pc/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

* They help to find specific bugs (localization).
* They are most useful to the developers who maintain the code later.
* There are usually a lot of low level specs since they need to cover all the low level details, special and edge cases.

## Further Read

This post is a result of reading "Behaviour Driven Development with JavaScript by Marco Emrich"[^http://www.amazon.com/Behaviour-Driven-Development-JavaScript-introduction-ebook/dp/B00CYMN3J2] and the subsequent research. Another grate resource, although beyond JavaScript scope, is "BDD in Action: Behavior-driven development for the whole software lifecycle"[^http://www.amazon.com/BDD-Action-Behavior-driven-development-lifecycle/dp/161729165X/].
