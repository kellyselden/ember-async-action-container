import Component from '@ember/component';
import layout from '../templates/components/async-action-container';
import EmberObject from '@ember/object';
import PromiseProxyMixin from '@ember/object/promise-proxy-mixin';
import { computed } from '@ember/object';
import { not, bool, or } from '@ember/object/computed';

const PromiseProxy = EmberObject.extend(PromiseProxyMixin);

export default Component.extend({
  layout,

  classNames: 'async-action-container',
  classNameBindings: [
    'default',
    'pending',
    'settled',
    'rejected',
    'fulfilled'
  ],

  default: not('promise').readOnly(),
  pending: bool('promiseProxy.isPending').readOnly(),
  settled: bool('promiseProxy.isSettled').readOnly(),
  rejected: bool('promiseProxy.isRejected').readOnly(),
  fulfilled: bool('promiseProxy.isFulfilled').readOnly(),

  _promiseProxy: computed('promise', function() {
    let promise = this.get('promise');
    if (promise) {
      return PromiseProxy.create({
        // `catch` hack is needed because you cannot end
        // with a rejected promise or else you get an
        // `unhandledrejection` error in the console
        promise: promise.catch(() => ({
          isPending: false,
          isSettled: true,
          isRejected: true,
          isFulfilled: false
        }))
      });
    }
  }).readOnly(),

  // needed for the `catch` hack above
  promiseProxy: or('_promiseProxy.content', '_promiseProxy').readOnly(),

  actions: {
    updatePromise() {
      let promise = this.get('action')();
      let callback = this.get('callback');
      if (callback) {
        callback(promise);
      } else {
        this.set('promise', promise);
      }
    }
  }
});
