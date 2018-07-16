// @flow

export default {
  '0': ({veryOldGuidelines, ...rest}: Object) => ({ ...rest, oldGuidelines: veryOldGuidelines }),
  '1': ({oldGuidelines, ...rest}: Object) => ({ ...rest, guidelines: oldGuidelines })
};
