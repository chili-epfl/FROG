// NOTE: This is not working after the upgrade, should be fixed (problem is that Jest doesn't
// process with Babel properly

// import { operator } from '../index';

// jest.mock('frog-utils', () => {
//   const createUUID = () => {
//     let cntr = -1;
//     return () => {
//       cntr += 1;
//       return cntr;
//     };
//   };
//   const uuid = createUUID();
//   const frogutils = require.requireActual('frog-utils');
//   return { ...frogutils, uuid };
// });

// test('Correctly parses API request results with contents', () =>
//   expect(operator({ tag: 'reason' })).resolves.toMatchSnapshot());

// test('Correctly parses API request results returning empty', () =>
//   expect(operator({ tag: 'empty' })).resolves.toMatchSnapshot());
