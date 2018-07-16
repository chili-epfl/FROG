// @flow

import {chainUpgrades} from 'frog-utils'
import {GraphObjUpgrades} from './versionUpgrades'

test('graph versioning test 1', () => {
  expect(GraphObjUpgrades['1'](version0)).toEqual(version1);
});

test('graph versioning test 2 with chain', () => {
  expect(chainUpgrades(GraphObjUpgrades,version0.graph.graphVersion, version1.graph.graphVersion)(version0)).toEqual(version1);
});

const version0 = {
  graph: {
    _id: "cjjk9sknf00043g6j3b69oke7",
    name: "Graph",
    createdAt: "2018-07-13T17:42:35.403Z",
    graphVersion: 0,
    duration: 120,
    broken: false
  },
  activities: [
    {
      _id: "cjjka7so900023g6j84ncncs6",
      length: 5,
      plane: 1,
      startTime: 6,
      title: "Viewer",
      configVersion: -1,
      activityType: "ac-image",
      data: {veryOldGuidelines: "test change guidelines those old guidelines"}
    }
  ],
  operators: [],
  connections: []
}

const version1 = {
  graph: {
    _id: "cjjk9sknf00043g6j3b69oke7",
    name: "Graph",
    createdAt: "2018-07-13T17:42:35.403Z",
    graphVersion: 1,
    duration: 120,
    broken: false
  },
  activities: [
    {
      _id: "cjjka7so900023g6j84ncncs6",
      length: 5,
      plane: 1,
      startTime: 6,
      title: "Viewer",
      configVersion: -1,
      activityType: "ac-gallery",
      data: {veryOldGuidelines: "test change guidelines those old guidelines"}
    }
  ],
  operators: [],
  connections: []
}
