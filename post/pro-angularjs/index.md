This article will teach you about the individual components of AngularJS (1.3) and how they come together to make an application, i.e. you will known what is an AngularJS application and how to build it. This article is biased towards the [community conventions](#conventions) and therefore ignores uncommon/ill/edge use cases (e.g. using HTML comments to reference a directive from the template). This article assumes that you have a good understanding of JavaScript.

All of the examples include references to the relevant documentation. If you are struggling to understand the included examples, refer to the documentation. All of the examples are in [JSFiddle](http://jsfiddle.net/).

If this is your first encounter with AngularJS, please first read the official [Developer Guide](https://docs.angularjs.org/guide/introduction). It explains what type of applications should be developed using AngularJS and what good using AngularJS achieves.

## Single-Page Applications

A typical [single-page application](http://en.wikipedia.org/wiki/Single-page_application) (SPA) starts with a stateless request to a server. The response is a document that executes the application. The application will load the necessary components (e.g. fragments of HTML and data to represent the current state of the application) in response to user actions. Typically, using [AJAJ](http://en.wikipedia.org/wiki/AJAJ). The goal is to provide a more fluid user experience akin to a desktop application. The page does not reload at any point in the process.

In contrast, round-trip app logic and data resides on the server side; the browser acts as a rendering engine. The browser makes a series of stateless requests that the server side responds to with dynamically generated HTML. The drawbacks are: a lot of bandwidth waste, the user need to wait until the next HTML document is requested and loaded.

AngularJS is used to develop single-page applications.

## REST

Single-page application requires a web-service (backend) to perform [create, read, update and delete](http://en.wikipedia.org/wiki/Create,_read,_update_and_delete) (CRUD) operations. In modern web development, such service conforms to [representational state transfer](http://en.wikipedia.org/wiki/Representational_state_transfer) (REST) architecture.

Two key players are the *URL* and the *request method*. The URL identifies the resource, and the HTTP method specifies what operation (CRUD) to perform.

| Method | Intent |
| --- | --- |
| `GET` | Retrieve object specified by the URL. `GET` method is *nullipotent* (the same operation performed 0 or more times does not change the result). |
| `PUT` | Update the object specified by the URL. `PUT` operation is *idempotent* (the same operation performed 1 or more times has the same effect on the data). |
| `POST` | Create a new object (can perform double duty: update an object if it exists or create a new one if not) (neither nullipotent  or idempotent). |
| `DELETE` | Delete the object specified by the URL (idempotent). |

## MVW

AngularJS advocates [Model-View-Whatever](https://plus.google.com/+AngularJS/posts/aZNVhj355G2) architectural pattern. Angular Controllers setup and add behavior to `$scope` objects, and Angular's [templates](#templates) and two-binding make the View layer, but Angular has virtually no opinion when it comes to your Model layer. You can do *whatever* you want.[^http://www.pseudobry.com/building-large-apps-with-angular-js/]

Regardless of what we are calling it, it is important to separate the presentation logic from business logic and presentation state. To this extent, we are going to be calling it MVC.

### MVC

| Player | Role |
| --- | --- |
| [Model](#model) | Logic that deals with storing and retrieving the data. |
| [View](#view) | Logic that deals with formatting data to display to the user. |
| [Controller](#controller) | Logic that responds to the user interactions, updates data in the model and provides data to the view. |

#### Model

Model should:

* Contain the logic for CRUD the domain data (even if that means executing the remote logic via web services).
* Define the [data domain](http://en.wikipedia.org/wiki/Data_domain).
* Provide a clean API that exposes the model data and operations on it.

Model should not:

* Expose the details of how the model data is obtained or managed (in other words, details of the data storage mechanism or the remote web service should not be exposed to the controllers and views).
* Contain the logic that transforms the model based on user interaction (this is the controller's job).
* Contain logic for displaying data to the user (this is the view's job).

The benefit of isolating model from the controller and view is that you can test your application logic more easily, and that enhancing and maintaining the overall application is simpler and easier.

#### Controller

Controller should:

* Contain the logic required to initialise the scope.
* Contain the logic/behaviours required by the view to present data from the scope.
* Contain the logic/behaviours required to update the scope based on user interaction.

Controller should not:

* Contain logic that manipulates the DOM (that is the job for the view).
* Contain logic that manages the persistence of data (that is the job for the model).
* Manipulate data outside of the scope.

#### View

Views should:

* Contain the logic and markup required to present data to the user.

Views should not:

* Contain complex logic (this is better placed in the controller).
* Contain logic that creates, stores or manipulates the domain model.

### Common design pitfalls

* Putting the logic in the wrong place (e.g. business logic in the view, rather than a controller; domain logic in the controller, rather than in a model; data store logic in the client model when using a RESTful service).
<!-- * Adopting the data store data format (abstract it with RESTful service). -->
* Manipulating the DOM directly using jQuery.

### Three rules to avoid the pitfalls

* View logic should prepare data only for display and never modify the model.
* Controller should never directly create, update or delete data from the model.
* The client should never directly access the database.

## Conventions

Angular puts itself forth as a [MVW](#mvw) framework (TL;DR you need conventions where framework does not enforce them).

These are the most popular community driven conventions (in the order of the number of stars on GitHub):

* [https://github.com/johnpapa/angularjs-styleguide](https://github.com/johnpapa/angularjs-styleguide)
* [https://github.com/mgechev/angularjs-style-guide](https://github.com/mgechev/angularjs-style-guide)
* [https://github.com/toddmotto/angularjs-styleguide](https://github.com/toddmotto/angularjs-styleguide)

If you are starting with AngularJS, follow either (the most popular) of the existing style guides. Personal advise: if you disagree with a certain aspect of the convention, raise an issue and explain your reason for doing otherwise. If the vast majority of the community disagrees with you, chances are that you are better off to just go with the flow.

<!-- ### Automation Over Convention -->

## Angular Components

### Functions

Angular provides a number of [utility functions](https://docs.angularjs.org/api/ng/function) for common programming tasks:

* [angular.lowercase](https://docs.angularjs.org/api/ng/function/angular.lowercase)
* [angular.uppercase](https://docs.angularjs.org/api/ng/function/angular.uppercase)
* [angular.forEach](https://docs.angularjs.org/api/ng/function/angular.forEach)
* [angular.extend](https://docs.angularjs.org/api/ng/function/angular.extend)
* [angular.noop](https://docs.angularjs.org/api/ng/function/angular.noop)
* [angular.identity](https://docs.angularjs.org/api/ng/function/angular.identity)
* [angular.isUndefined](https://docs.angularjs.org/api/ng/function/angular.isUndefined)
* [angular.isDefined](https://docs.angularjs.org/api/ng/function/angular.isDefined)
* [angular.isObject](https://docs.angularjs.org/api/ng/function/angular.isObject)
* [angular.isString](https://docs.angularjs.org/api/ng/function/angular.isString)
* [angular.isNumber](https://docs.angularjs.org/api/ng/function/angular.isNumber)
* [angular.isDate](https://docs.angularjs.org/api/ng/function/angular.isDate)
* [angular.isArray](https://docs.angularjs.org/api/ng/function/angular.isArray)
* [angular.isFunction](https://docs.angularjs.org/api/ng/function/angular.isFunction)
* [angular.isElement](https://docs.angularjs.org/api/ng/function/angular.isElement)
* [angular.copy](https://docs.angularjs.org/api/ng/function/angular.copy)
* [angular.equals](https://docs.angularjs.org/api/ng/function/angular.equals)
* [angular.bind](https://docs.angularjs.org/api/ng/function/angular.bind)
* [angular.toJson](https://docs.angularjs.org/api/ng/function/angular.toJson)
* [angular.fromJson](https://docs.angularjs.org/api/ng/function/angular.fromJson)

The list is limiting and depends on the needs of the Angular core development team. For this reason, I prefer the route that the [Backbone](http://backbonejs.org/) took. Backbone.js has a hard dependency for [Underscore](http://underscorejs.org/), which is a standalone collection of utility functions. While I don't recommend Angular team to have a hard dependency on an external utility function collection, I advise against using utility functions that are hard-coded into the framework and whose primary function is to support the framework.

If you are starting a large scale application, I advise to not use either of the above functions and familiarize with either of the standalone utility libraries ([lodash](https://lodash.com/), [Underscore](http://underscorejs.org/), [lazy.js](http://danieltao.com/lazy.js/)). Whatever you choose, be consistent.

The following functions are specific to AngularJS:

#### angular.bootstrap

Use [angular.bootstrap](https://docs.angularjs.org/api/ng/function/angular.bootstrap) to manually start up angular application.

The example does not use the [ngApp](https://docs.angularjs.org/api/ng/directive/ngApp) directive to auto-bootstrap an application.

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/ahwmh5rc/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

#### angular.reloadWithDebugInfo

Use [angular.reloadWithDebugInfo](https://docs.angularjs.org/api/ng/function/angular.reloadWithDebugInfo) to reload the current application with debug information turned on.

Debug mode:

* Attaches information about the bindings (`$binding` property of the [element's data](http://api.jquery.com/data/); data is in the jQlite scope and not in the `HTMLElement.dataset`).
* Adds CSS classes ("ng-binding") to data-bound elements (as a result of `ngBind`, `ngBindHtml` or `{{...}}` interpolations).
* Where the compiler has created a new scope, the scope and either "ng-scope" or "ng-isolated-scope" CSS class are attached to the corresponding element. These scope references can then be accessed via `element.scope()` and `element.isolateScope()`.

Debug information is enabled by default. This function is used when [`$compileProvider.debugInfoEnabled()`](https://docs.angularjs.org/api/ng/provider/$compileProvider#debugInfoEnabled) has been used to disable debug information.

[Disable debug information](https://docs.angularjs.org/guide/production#disabling-debug-data) in production for a significant performance boost. In production, you can call `angular.reloadWithDebugInfo()` in browser console to enable debug information.

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/41nehwhq/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

#### angular.injector

[angular.injector](https://docs.angularjs.org/api/ng/function/angular.injector) creates an injector object (`$injector`). [`$injector`](https://docs.angularjs.org/api/auto/service/$injector) is used to retrieve object instances as defined by provider, instantiate types, invoke methods, and load modules.

Angular creates a single $injector when it bootstraps an application and uses the single $injector to invoke controller functions, service functions, filter functions, and any other function that might need dependencies as parameters.[^http://odetocode.com/blogs/scott/archive/2014/01/13/meet-the-angularjs-injector.aspx]. You can obtain an instance of the injector:

* If you manually bootstrap the application (using `angular.bootstrap()`).
* Using `angular.element([DOM node]).injector()` where [DOM element] is a DOM element where the `ng-app` was defined (or a child element of this element).
* Using DI, e.g. `$injector` parameter in the `module.config()`.

`angular.injector()` is for creating a new instance of the `$injector`.

Creating your own injector is useful in unit tests where you do not want singleton service instances. You must pass a list of the modules the injector will work with (just the core "ng" module in the above code). You have to explicitly list the ng module if you are going to use any services from the core of Angular. Unlike the angular.module method, which assumes you have a dependency on the ng module and will silently add "ng" to your list of dependencies, the injector function makes no assumptions about dependent modules.[^http://odetocode.com/blogs/scott/archive/2014/01/13/meet-the-angularjs-injector.aspx]

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/nmL76ecL/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

#### angular.element

[angular.element](https://docs.angularjs.org/api/ng/function/angular.element) wraps a raw DOM element or HTML string as a jQuery-like element.

Angular is using a [built-in subset of jQuery](https://docs.angularjs.org/api/ng/function/angular.element#angular-s-jqlite), called "jQuery lite" or "jqLite".

Refer to the official documentation of [angular.element](https://docs.angularjs.org/api/ng/function/angular.element) to learn about jQuery-lite specific methods and events.

#### angular.module

The [angular.module](https://docs.angularjs.org/api/ng/function/angular.module) is a global place for creating, registering and retrieving Angular modules. All modules (angular core or 3rd party) that should be available to an application must be registered using this mechanism.

When passed two or more arguments, a new module is created. If passed only one argument, an existing module (the name passed as the first argument to module) is retrieved.

A module is a collection of services, directives, controllers, filters, and configuration information. angular.module is used to configure the $injector.

## Templates

In Angular, templates are written with HTML that contains Angular-specific elements and attributes. Angular combines the template with information from the model and controller to render the dynamic view that a user sees in the browser.

AngularJS extends HTML in the following ways:

* [Expressions & Data binding](#expressions-data-binding).
* [Directives](#directives)

### Expressions & Data Binding

AngularJS uses double-brace characters (`{{` and `}}`) to denote expression. The content of the expression is evaluated as a subset of JavaScript in the context of the `scope`. Expressions are evaluated using [$interpolate](https://docs.angularjs.org/api/ng/service/$interpolate) service.

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/0ctqp3wa/embedded/html,js,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

Angular expressions are like JavaScript expressions with the following differences:

* [Context](#context)
* [Forgiving](#forgiving)
* You cannot use the following in an Angular expression: conditionals, loops, or exceptions.
* You cannot declare functions in an Angular expression.
* You cannot create regular expressions in an Angular expression.
* You cannot use `,` or `void` in an Angular expression.
* You can use [filters](https://docs.angularjs.org/api/ng/filter/filter) within expressions to format data before displaying it.

#### Context

In Angular, expressions are evaluated against a scope object, i.e. Angular expressions do not have access to global variables like `window`, `document` or `location`.

In addition to implicit variables and inherited scope variables, every scope inherits these properties from the [$rootScope](https://docs.angularjs.org/api/ng/type/$rootScope.Scope):

| Property | Description |
| --- | --- |
| `$id` | Unique scope ID (monotonically increasing) useful for debugging. |
| `$parent` | Reference to the parent scope. |
| `$root` | Reference to the root scope. |

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/wq6wf4fu/embedded/html,js,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

#### Forgiving

Angular expression that evaluates to undefined scope property does not throw an error.

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/puxqmn52/embedded/html,js,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

## Directives

* Directives are functions.
* Directives are referenced in HTML templates using element-names and attributes.
* Directives define a custom behavior and transform the associated DOM element(s).
* Angular has [inbuilt directives](https://docs.angularjs.org/api/ng/directive).
* New directives can be declared using [`module.directive`](https://docs.angularjs.org/api/ng/type/angular.Module#directive).

### Example

| Directive | Role |
| --- | --- |
| [`ng-app`](https://docs.angularjs.org/api/ng/directive/ngApp) | [Bootstraps](#bootstrap) an Angular application. |
| [`ng-bind`](https://docs.angularjs.org/api/ng/directive/ngBind) | Attribute-reference equivalent of the [double-brace expression](#expressions-data-binding). |
| `gajus-bar` | Custom directive. |
| `gajus-baz` | Intentionally misspelled reference to `gajusBar` directive. |

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/bw3nfL4r/embedded/html,js,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

#### Referencing

The [HTML compiler](https://docs.angularjs.org/guide/compiler) traverses the DOM matching directives against the DOM elements. HTML compiler must know the directive name before it can be matched in DOM. Elements that have names or attributes that do not resolve to an existing directive will be left intact. In the earlier example, `ngApp`, `ngBind` and `gajusBar` are resolved; `gajus-baz` is misspelled reference to `gajusBar`. Notice that there is no error; Angular ignores unknown elements and attributes.

#### Naming

* Directive declaration is in camelCase (e.g. `gajusBar`).
* Directive reference is dash-delimited name (e.g. `gajus-bar`).
* Inbuilt directives are prefixed with `ng`.
* Custom directives must be prefixed with a short, unique and descriptive prefix.[^https://github.com/johnpapa/angularjs-styleguide#style-y073]



### Inbuilt

Angular has many [inbuilt directives](https://docs.angularjs.org/api/ng/directive) for:

* DOM control structures (repeating/hiding/conditionally including DOM fragments).
* Event handling (click, submit, etc.).


### Custom

* Directives are created using the [`directive`](https://docs.angularjs.org/api/ng/type/angular.Module#directive) method on an Angular `module`.
* Directives are referenced from HTML templates using element-name or attribute.

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/ypnedrb1/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

In the "foo" example, I am:

* Defined "foo" module.
* Defined "bar" directive.
* Instructed directive to:
    * replace the referencing element with the template.
    * respond to attribute reference.
    * use string template

<!--
and passing in the name of the directive ("cartSummary" in this case) and a factory function that returns a directive definition object  (https://gist.github.com/gajus/07145f189dc7a19dd03f#file-gistfile1-js-L36). The list of properties are described at https://docs.angularjs.org/api/ng/service/$compile#directive-definition-object. Notice that although I used the name "cartSummary" when I defined the directive in Listing 7-8, the element I added to the app.html file is cart-summary. AngularJS normalizes component names to map between these formats,
-->

### Community

There are a number of Angular directives made open-source by the community available for the re-use:

* [http://ngmodules.org/](http://ngmodules.org/)
* [https://github.com/search?l=JavaScript&q=angular+directive&type=Repositories](https://github.com/search?l=JavaScript&q=angular+directive&type=Repositories)

<!--
## ngApp

"ng-app" attribute is the first thing that you will notice when looking at the AngularJS view.

<iframe width="100%" height="300" src="http://jsfiddle.net/gajus/ceehLo60/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

"ng-app" is a *directive* that instructs AngularJS to evaluate a specific section of the document using a specific *module*.

<figure class="quote">
    <blockquote>
        <p>At a high level, <em>directives</em> are markers on a DOM element (such as an attribute, element name, comment or CSS class) that tell AngularJS's HTML compiler ($compile) to attach a specified behavior to that DOM element or even transform the DOM element and its children.</p>
    </blockquote>
    <figcaption>https://docs.angularjs.org/guide/directive</figcaption>
</figure>

<figure class="quote">
    <blockquote>
        <p><em>[module]</em> is a container for the different parts of your app – controllers, services, filters, directives, etc.</p>
    </blockquote>
    <figcaption>https://docs.angularjs.org/guide/module</figcaption>
</figure>
-->

## Further Reading

* [Pro AngularJS](http://www.apress.com/9781430264484) by Adam Freeman.
* [Write Modern Web Apps with the MEAN Stack: Mongo, Express, AngularJS, and Node.js](http://www.peachpit.com/store/write-modern-web-apps-with-the-mean-stack-mongo-express-9780133962352) by Jeff Dickey
* [D3 on AngularJS](https://leanpub.com/d3angularjs) by Ari Lerner and Victor Powell
