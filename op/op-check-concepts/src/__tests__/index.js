// @flow
import op from '../index';
import { type activityDataT } from 'frog-utils';

const activityData: activityDataT = {
  structure: 'all',
  payload: { all: { data: { text: 'This is a test heures' } } }
};

const config = {
  concepts: [
    {
      keyword:
        'compte*, nombre, comptage*, dénombrage, nombre de personnes, nombre d’arrivées, nombre d’entrée',
      prompt: 'Est-ce que vous avez pensé à compter?'
    },
    {
      keyword: 'estimation*, moyenne, médiane, prédiction*',
      prompt: 'Est-ce que vous avez pensé à estimer?'
    },
    {
      keyword:
        'plusieurs mardis, soirs, semaines, jours, heures, observations, régulièrement, entre 17h et 19h',
      prompt: 'Est-ce que vous avez pensé à la représentativité?'
    }
  ]
};

test('works with all', () => {
  expect(op.operator(config, { activityData })).toEqual({
    payload: {
      all: {
        config:
          'Est-ce que vous avez pensé à compter?\nEst-ce que vous avez pensé à estimer?',
        data: { text: 'This is a test heures' }
      }
    },
    structure: 'all'
  });
});
