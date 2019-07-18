// @flow
import { type controlOperatorRunnerT } from '/imports/frog-utils';

const operator = (configData, object) => {
  const isHighPerformer = configData.use_percentage
    ? (actual, max, scaled) =>
        scaled
          ? scaled >= configData.min_percentage / 100
          : actual / max >= configData.min_percentage / 100
    : (actual, _, __) => actual >= configData.min_correct;

  const data = object.activityData;
  const high = [];
  const low = [];
  if (data.structure === 'individual') {
    Object.keys(data.payload).forEach(student => {
      if (!data.payload[student].data) {
        low.push(student);
      } else if (
        isHighPerformer(
          data.payload[student].data.correctCount,
          data.payload[student].data.maxCorrect,
          data.payload[student].data.scaledScore
        )
      ) {
        high.push(student);
      } else {
        low.push(student);
      }
    });
  }
  return {
    list: {
      [configData.activity_low]: {
        structure: 'individual',
        mode: 'include',
        payload: low.reduce((acc, stud) => ({ ...acc, [stud]: true }), {})
      },
      [configData.activity_high]: {
        structure: 'individual',
        mode: 'include',
        payload: high.reduce((acc, stud) => ({ ...acc, [stud]: true }), {})
      }
    }
  };
};

export default (operator: controlOperatorRunnerT);
