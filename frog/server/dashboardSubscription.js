import { Meteor } from 'meteor/meteor';
import { uuid } from 'frog-utils';

function update(that) {
  that.changed('counter', 1, { date: new Date() });
}

let interval;
const subscriptions = {};
let initial = true;

export default () => {
  Meteor.publish('counter', function() {
    const id = uuid();
    subscriptions[id] = true;
    if (!interval) {
      interval = setInterval(() => update(this), 1000);
    }
    if (initial) {
      this.added('counter', 1, { date: new Date() });
      initial = false;
    }
    this.ready();
    this.onStop(() => {
      delete subscriptions[id];
      if (Object.keys(subscriptions).length === 0) {
        clearInterval(interval);
        interval = false;
      }
    });
  });
};
