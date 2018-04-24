ember-async-action-container
==============================================================================

[![npm version](https://badge.fury.io/js/ember-async-action-container.svg)](https://badge.fury.io/js/ember-async-action-container)
[![Build Status](https://travis-ci.org/kellyselden/ember-async-action-container.svg?branch=master)](https://travis-ci.org/kellyselden/ember-async-action-container)

An async state wrapper

A spiritual successor to https://github.com/DockYard/ember-async-button

Installation
------------------------------------------------------------------------------

```
ember install ember-async-action-container
```


Usage
------------------------------------------------------------------------------

```hbs
{{#async-action-container
  action=(action "myAction")
  as |action promise|
}}
  <button
    disabled={{promise.isPending}}
    {{action action}}
  >
    {{#if promise.isPending}}
      Submitting
    {{else}}
      Submit
    {{/if}}
  </button>
{{/async-action-container}}
```

If you want reset state:

```hbs
{{#async-action-container
  action=(action "myAction")
  callback=(action (mut myPromise))
  promise=myPromise
  as |action promise|
}}
  <button
    disabled={{or
      promise.isPending
      promise.isFulfilled
    }}
    {{action action}}
  >
    {{#if promise.isPending}}
      Submitting
    {{else if promise.isRejected}}
      Submit again
    {{else if promise.isFulfilled}}
      Submitted
    {{else}}
      Submit
    {{/if}}
  </button>
{{/async-action-container}}
```

Then

```js
this.set('myPromise', null);
```

to reset.

The CSS classes exposed are `default`, `pending`, `settled`, `rejected`, and `fulfilled`.


Contributing
------------------------------------------------------------------------------

### Installation

* `git clone <repository-url>`
* `cd ember-async-action-container`
* `npm install`

### Linting

* `npm run lint:js`
* `npm run lint:js -- --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `ember try:each` – Runs the test suite against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
