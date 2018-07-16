// @flow

export default {
  '0': obj => ({ ...obj, oldGuidelines: obj.veryOldGuidelines }),
  '1': obj => ({ ...obj, guidelines: obj.oldGuidelines })
};
