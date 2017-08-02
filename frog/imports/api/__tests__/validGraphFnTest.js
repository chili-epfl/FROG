// @flow

import v from '../validGraphFn';

const valid = (act, op, con) => v(act, op, con).errors;

const resultToIds = graph =>
  valid(graph.activities, graph.operators, graph.connections).map(x => x.id);

test('Test activity with no type defined => unvalid', () => {
  expect(resultToIds(g1)).toEqual(['cj5aziwnz00003k6ow2oj34gx']);
});

test('Test activity with type defined => valid', () => {
  expect(resultToIds(g2).length).toEqual(0);
});

test('Test operator with no type defined => unvalid', () => {
  expect(resultToIds(g3)).toEqual(['cj5azl3d600033k6og3gtozas']);
});

test('Test operator with type defined => valid', () => {
  expect(resultToIds(g4).length).toEqual(0);
});

test('Test group activity without social operator => unvalid', () => {
  expect(resultToIds(g5)).toEqual(['cj5azm5kf00063k6o7vwz37pt']);
});

test('Test group activity with social operator => valid', () => {
  expect(resultToIds(g6).length).toEqual(0);
});

test('Test group activity with product operator => unvalid', () => {
  expect(resultToIds(g7)).toEqual(['cj5azm5kf00063k6o7vwz37pt']);
});

test("Test activityType desn't exist => unvalid", () => {
  expect(resultToIds(g8)).toEqual(['cj5azthci000d3k6o919vps5d']);
});

test('Test operator does not have outgoing connections', () => {
  expect(resultToIds(g9)).toEqual(['cj5szsc93000b3k6o3suw338f']);
});

const g1 = {
  graph: {
    _id: 'cj5aziuo400003k6om24tozbn',
    name: 'TestNTA',
    createdAt: '2017-07-19T12:29:17.381Z',
    duration: 120
  },
  activities: [
    {
      _id: 'cj5aziwnz00003k6ow2oj34gx',
      title: 'noTypeAct',
      startTime: 0,
      length: 5,
      plane: 1
    }
  ],
  operators: [],
  connections: []
};

const g2 = {
  graph: {
    _id: 'cj5aziuo400003k6om24tozbn',
    name: 'TestTA',
    createdAt: '2017-07-19T12:29:17.381Z',
    duration: 120
  },
  activities: [
    {
      _id: 'cj5azthci000d3k6o919vps5d',
      title: 'video',
      startTime: 0,
      length: 5,
      plane: 1,
      activityType: 'ac-video'
    }
  ],
  operators: [],
  connections: []
};

const g3 = {
  graph: {
    _id: 'cj5aziuo400003k6om24tozbn',
    name: 'TestNTO',
    createdAt: '2017-07-19T12:29:17.381Z',
    duration: 120
  },
  activities: [],
  operators: [
    {
      _id: 'cj5azl3d600033k6og3gtozas',
      time: 1.7112676056338028,
      y: 327,
      type: 'social'
    }
  ],
  connections: [
    {
      _id: 'cj5azrxuo000a3k6oo1j2ek0k',
      source: { type: 'operator', id: 'cj5azl3d600033k6og3gtozas' },
      target: { type: 'activity', id: 'cj5azm5kf00063k6o7vwz37pt' }
    }
  ]
};

const g4 = {
  graph: {
    _id: 'cj5aziuo400003k6om24tozbn',
    name: 'TestTO',
    createdAt: '2017-07-19T12:29:17.381Z',
    duration: 120
  },
  activities: [],
  operators: [
    {
      _id: 'cj5azuchn000e3k6oidbdvsfq',
      time: 2.936619718309859,
      y: 295,
      type: 'social',
      operatorType: 'op-group-identical'
    }
  ],
  connections: [
    {
      _id: 'cj5azrxuo000a3k6oo1j2ek0k',
      source: { type: 'operator', id: 'cj5azuchn000e3k6oidbdvsfq' },
      target: { type: 'activity', id: 'cj5azm5kf00063k6o7vwz37pt' }
    }
  ]
};

const g5 = {
  graph: {
    _id: 'cj5aziuo400003k6om24tozbn',
    name: 'TestGAWSO',
    createdAt: '2017-07-19T12:29:17.381Z',
    duration: 120
  },
  activities: [
    {
      _id: 'cj5azm5kf00063k6o7vwz37pt',
      title: 'chat',
      startTime: 0,
      length: 5,
      plane: 2,
      groupingKey: 'group',
      activityType: 'ac-chat'
    }
  ],
  operators: [],
  connections: []
};

const g6 = {
  graph: {
    _id: 'cj5aziuo400003k6om24tozbn',
    name: 'TestGASO',
    createdAt: '2017-07-19T12:29:17.381Z',
    duration: 120
  },
  activities: [
    {
      _id: 'cj5azm5kf00063k6o7vwz37pt',
      title: 'chat',
      startTime: 5,
      length: 5,
      plane: 2,
      groupingKey: 'group',
      activityType: 'ac-chat'
    }
  ],
  operators: [
    {
      _id: 'cj5azrrd300093k6ohkihm0y4',
      time: 1.890625,
      y: 338,
      type: 'social',
      operatorType: 'op-create-groups'
    }
  ],
  connections: [
    {
      _id: 'cj5azrxuo000a3k6oo1j2ek0k',
      source: { type: 'operator', id: 'cj5azrrd300093k6ohkihm0y4' },
      target: { type: 'activity', id: 'cj5azm5kf00063k6o7vwz37pt' }
    }
  ]
};

const g7 = {
  graph: {
    _id: 'cj5aziuo400003k6om24tozbn',
    name: 'TestGAPO',
    createdAt: '2017-07-19T12:29:17.381Z',
    duration: 120
  },
  activities: [
    {
      _id: 'cj5azm5kf00063k6o7vwz37pt',
      title: 'chat',
      startTime: 5,
      length: 5,
      plane: 2,
      groupingKey: 'group',
      activityType: 'ac-chat'
    }
  ],
  operators: [
    {
      _id: 'cj5azsc93000b3k6o3suw0m8f',
      time: 1.9014084507042253,
      y: 340,
      type: 'product',
      operatorType: 'op-jigsaw',
      data: { roles: 'chief' }
    }
  ],
  connections: [
    {
      _id: 'cj5azsinp000c3k6oqnj5ske9',
      source: { type: 'operator', id: 'cj5azsc93000b3k6o3suw0m8f' },
      target: { type: 'activity', id: 'cj5azm5kf00063k6o7vwz37pt' }
    }
  ]
};

const g8 = {
  graph: {
    _id: 'cj5aziuo400003k6om24tozbf',
    name: 'TestATUV',
    createdAt: '2017-07-19T12:29:17.381Z',
    duration: 120
  },
  activities: [
    {
      _id: 'cj5azthci000d3k6o919vps5d',
      title: 'video',
      startTime: 0,
      length: 5,
      plane: 1,
      activityType: 'false-activity'
    }
  ],
  operators: [],
  connections: []
};

const g9 = {
  graph: {
    _id: 'cj5aziuo400003k6om24tozbn',
    name: 'TestNTA',
    createdAt: '2017-07-19T12:29:17.381Z',
    duration: 120
  },
  activities: [],
  operators: [
    {
      _id: 'cj5szsc93000b3k6o3suw338f',
      time: 1.9014084507042253,
      y: 340,
      type: 'product',
      operatorType: 'op-jigsaw',
      data: { roles: 'chief' }
    }
  ],
  connections: []
};
