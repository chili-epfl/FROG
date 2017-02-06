import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { $ } from 'meteor/jquery';

if (Meteor.isClient) {
  it('renders the top level menu', () => { // eslint-disable-line
    assert.equal(
      $('a')[0].outerText,
      'Home'
    );
  });
}
