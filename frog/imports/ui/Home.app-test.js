import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { $ } from 'meteor/jquery';

if (Meteor.isClient) {
  it('renders the correct list when routed to', () => { // eslint-disable-line
    assert.equal(
      $('h1')[0].textContent,
      'FROG  - Fabricating and Running Orchestration Graphs'
    );
  });
}
