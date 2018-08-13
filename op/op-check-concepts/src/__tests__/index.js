import { type activityDataT, chainUpgrades } from 'frog-utils';

import operator from '../operatorRunner';
import pkg from '../index';

const activityData: activityDataT = {
  structure: 'all',
  payload: { all: { data: { text: 'This is a test heures' }, config: {} } }
};

const globalStructure = { studentIds: ['a'], students: { a: 'a' } };

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
  expect(
    operator(config, {
      activityData,
      socialStructure: {},
      globalStructure
    })
  ).toEqual({
    payload: {
      all: {
        config: {
          prompt:
            'Est-ce que vous avez pensé à compter?\nEst-ce que vous avez pensé à estimer?'
        },
        data: { text: 'This is a test heures' }
      }
    },
    structure: 'all'
  });
});

test('upgrade01to02', () => {
  expect(pkg.upgradeFunctions['0'](dataV1)).toEqual(dataV2);
});
//
test('upgrade02to1', () => {
  expect(pkg.upgradeFunctions['1'](dataV2)).toEqual(dataV3);
});

test('upgrade01to1', () => {
  const tmpV2 = pkg.upgradeFunctions['0'](dataV1);
  expect(pkg.upgradeFunctions['1'](tmpV2)).toEqual(dataV3);
});

test('chainUpgrades01to02', () => {
  expect(chainUpgrades(pkg.upgradeFunctions, -1, 0)(dataV1)).toEqual(dataV2);
});

test('chainUpgrades02to1', () => {
  expect(chainUpgrades(pkg.upgradeFunctions, 0, 1)(dataV2)).toEqual(dataV3);
});

test('chainUpgrades01to1', () => {
  expect(chainUpgrades(pkg.upgradeFunctions, -1, 1)(dataV1)).toEqual(dataV3);
});

const dataV1 = {
  concepts: {
    '0': {
      keyword: ['compte', 'nombre', 'comptage', 'dénombrage'],
      prompt:
        'Est-ce que votre solution considère correctement le comptage des arrivées?'
    },
    '1': {
      keyword: ['estimation', 'moyenne', 'médiane', 'prédiction'],
      prompt:
        "Est-ce que votre solution considère correctement l'intensité des arrivées?"
    },
    '2': {
      keyword: [
        'plusieurs mardis',
        'soirs',
        'semaines',
        'jours',
        'heures',
        'observations',
        'régulièrement',
        'entre 17h et 19h.'
      ],
      prompt:
        'Est-ce que votre solution considère correctement la représentativité des arrivées?'
    }
  }
};

const dataV2 = {
  concepts: [
    {
      keyword: ['compte', 'nombre', 'comptage', 'dénombrage'],
      prompt:
        'Est-ce que votre solution considère correctement le comptage des arrivées?'
    },
    {
      keyword: ['estimation', 'moyenne', 'médiane', 'prédiction'],
      prompt:
        "Est-ce que votre solution considère correctement l'intensité des arrivées?"
    },
    {
      keyword: [
        'plusieurs mardis',
        'soirs',
        'semaines',
        'jours',
        'heures',
        'observations',
        'régulièrement',
        'entre 17h et 19h.'
      ],
      prompt:
        'Est-ce que votre solution considère correctement la représentativité des arrivées?'
    }
  ]
};

const dataV3 = {
  concepts: [
    {
      keyword: 'compte, nombre, comptage, dénombrage',
      prompt:
        'Est-ce que votre solution considère correctement le comptage des arrivées?'
    },
    {
      keyword: 'estimation, moyenne, médiane, prédiction',
      prompt:
        "Est-ce que votre solution considère correctement l'intensité des arrivées?"
    },
    {
      keyword:
        'plusieurs mardis, soirs, semaines, jours, heures, observations, régulièrement, entre 17h et 19h.',
      prompt:
        'Est-ce que votre solution considère correctement la représentativité des arrivées?'
    }
  ]
};
