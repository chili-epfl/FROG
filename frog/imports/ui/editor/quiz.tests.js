import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { shallow } from  'enzyme';
import { Factory } from 'meteor/factory';

import { Quiz } from './Quiz.jsx';

describe('Quiz', () => {
  describe('methods', () {
    it('should add choice when clicking add choice', () => {
      sinon.stub(Quiz.createChoice, 'call');
      const quiz = Factory.create('quiz');
      const item = shallow(<Quiz quiz={quiz} />);

      item.find('input[type="button"]').simulate('click');
      expect(Quiz.createChoice).toBeCalled();
    });
  });
});
