// @flow

export default {
  '0': (obj: Object) => ({ ...obj, oldGuidelines: obj.veryOldGuidelines }),
  '1': (obj: Object) => ({ ...obj, guidelines: obj.oldGuidelines })
};
