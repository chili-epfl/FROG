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

test('upgrade1to2', () => {
  expect(pkg.upgradeFunctions['2'](dataV1)).toEqual(dataV2);
});
//
test('upgrade2to3', () => {
  expect(pkg.upgradeFunctions['3'](dataV2)).toEqual(dataV3);
});

test('upgrade1to3', () => {
  const tmpV2 = pkg.upgradeFunctions['2'](dataV1);
  expect(pkg.upgradeFunctions['3'](tmpV2)).toEqual(dataV3);
});

test('chainUpgrades1to2', () => {
  expect(chainUpgrades(pkg.upgradeFunctions, 1, 2)(dataV1)).toEqual(dataV2);
});

test('chainUpgrades2to3', () => {
  expect(chainUpgrades(pkg.upgradeFunctions, 2, 3)(dataV2)).toEqual(dataV3);
});

test('chainUpgrades1to3', () => {
  expect(chainUpgrades(pkg.upgradeFunctions, 1, 3)(dataV1)).toEqual(dataV3);
});

const dataV1 = {
  concepts: {
    0: {
      keyword: ['compte', 'nombre', 'comptage', 'dénombrage'],
      prompt:
        'Est-ce que votre solution considère correctement le comptage des arrivées?'
    },
    1: {
      keyword: ['estimation', 'moyenne', 'médiane', 'prédiction'],
      prompt:
        "Est-ce que votre solution considère correctement l'intensité des arrivées?"
    },
    2: {
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
