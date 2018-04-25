import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, waitFor } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { defer } from 'rsvp';

let deferred;

module('Integration | Component | async-action-container', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    deferred = defer();
    this.set('myAction', () => deferred.promise);
  });

  test('it works', async function(assert) {
    await render(hbs`
      {{#async-action-container
        action=(action myAction)
        as |click promise|
      }}
        <button {{action click}}></button>
        isPending {{promise.isPending}}
      {{/async-action-container}}
    `);

    let element = assert.dom('.async-action-container');

    element.hasClass('default');
    element.doesNotHaveClass('pending');
    element.doesNotHaveClass('settled');
    element.doesNotHaveClass('rejected');
    element.doesNotHaveClass('fulfilled');
    element.hasText('isPending');

    let promise = click('button');

    await waitFor('.pending');

    element.doesNotHaveClass('default');
    element.hasClass('pending');
    element.doesNotHaveClass('settled');
    element.doesNotHaveClass('rejected');
    element.doesNotHaveClass('fulfilled');
    element.hasText('isPending true');

    deferred.reject();

    await promise;

    element.doesNotHaveClass('default');
    element.doesNotHaveClass('pending');
    element.hasClass('settled');
    element.hasClass('rejected');
    element.doesNotHaveClass('fulfilled');
    element.hasText('isPending false');

    deferred = defer();

    promise = click('button');

    await waitFor('.pending');

    element.doesNotHaveClass('default');
    element.hasClass('pending');
    element.doesNotHaveClass('settled');
    element.doesNotHaveClass('rejected');
    element.doesNotHaveClass('fulfilled');
    element.hasText('isPending true');

    deferred.resolve();

    await promise;

    element.doesNotHaveClass('default');
    element.doesNotHaveClass('pending');
    element.hasClass('settled');
    element.doesNotHaveClass('rejected');
    element.hasClass('fulfilled');
    element.hasText('isPending false');
  });

  test('it allows resetting the promise', async function(assert) {
    await render(hbs`
      {{#async-action-container
        action=(action myAction)
        callback=(action (mut promise))
        promise=promise
        as |click promise|
      }}
        <button {{action click}}></button>
        isPending {{promise.isPending}}
      {{/async-action-container}}
    `);

    let element = assert.dom('.async-action-container');

    element.hasClass('default');
    element.doesNotHaveClass('pending');
    element.doesNotHaveClass('settled');
    element.doesNotHaveClass('rejected');
    element.doesNotHaveClass('fulfilled');
    element.hasText('isPending');

    let promise = click('button');

    await waitFor('.pending');

    element.doesNotHaveClass('default');
    element.hasClass('pending');
    element.doesNotHaveClass('settled');
    element.doesNotHaveClass('rejected');
    element.doesNotHaveClass('fulfilled');
    element.hasText('isPending true');

    deferred.resolve();

    await promise;

    element.doesNotHaveClass('default');
    element.doesNotHaveClass('pending');
    element.hasClass('settled');
    element.doesNotHaveClass('rejected');
    element.hasClass('fulfilled');
    element.hasText('isPending false');

    this.set('promise', null);

    element.hasClass('default');
    element.doesNotHaveClass('pending');
    element.doesNotHaveClass('settled');
    element.doesNotHaveClass('rejected');
    element.doesNotHaveClass('fulfilled');
    element.hasText('isPending');

    deferred = defer();

    promise = click('button');

    await waitFor('.pending');

    element.doesNotHaveClass('default');
    element.hasClass('pending');
    element.doesNotHaveClass('settled');
    element.doesNotHaveClass('rejected');
    element.doesNotHaveClass('fulfilled');
    element.hasText('isPending true');

    deferred.resolve();

    await promise;

    element.doesNotHaveClass('default');
    element.doesNotHaveClass('pending');
    element.hasClass('settled');
    element.doesNotHaveClass('rejected');
    element.hasClass('fulfilled');
    element.hasText('isPending false');

    this.set('promise', null);

    element.hasClass('default');
    element.doesNotHaveClass('pending');
    element.doesNotHaveClass('settled');
    element.doesNotHaveClass('rejected');
    element.doesNotHaveClass('fulfilled');
    element.hasText('isPending');
  });
});
