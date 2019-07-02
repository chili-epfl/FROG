import pkg from '../index';

const config = {
  plane: 'individual',
  instructions: 'instr',
  reviewCount: 3,
  reviewPrompt: 'review',
  reviseInstructions: 'revise'
};
const config2 = {
  plane: 'group',
  instructions: 'instr',
  reviewCount: 3,
  reviewPrompt: 'review',
  reviseInstructions: 'revise'
};

test('p1', () => {
  expect(pkg.makeTemplate(config)).toEqual({});
});

test('p2', () => {
  expect(pkg.makeTemplate(config2)).toEqual({});
});
