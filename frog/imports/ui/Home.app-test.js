import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { DDP } from 'meteor/ddp-client';
import { assert } from 'meteor/practicalmeteor:chai';
import { Promise } from 'meteor/promise';
import { $ } from 'meteor/jquery';

if (Meteor.isClient) {
  it('renders the correct list when routed to', () => {
        assert.equal($('h1')[0].textContent, "FROG - FABRICATING AND RUNNING ORCHESTRATION GRAPHS");
  });
};
