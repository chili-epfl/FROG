export default {
  graph: {
    _id: 'cjzb9cktt000101rsgx9q3dfp',
    name: 'Student writing',
    ownerId: 'TcCcpfEyr2mjMpzYw',
    createdAt: '2019-08-14T12:55:30.929Z',
    graphVersion: 2,
    broken: false,
    duration: 60
  },
  activities: [
    {
      _id: 'cjzb9cktv000201rs6r5k65du',
      length: 5,
      plane: 1,
      startTime: 7,
      title: 'Editing text',
      activityType: 'li-richText',
      configVersion: 1,
      data: {
        instructions: '{{instructions}}',
        useInstructionsForCategory: '{{useInstructions}}',
        allowEditing: true,
        openIncomingInEdit: true,
        liTypeEditor: 'li-richText'
      },
      groupingKey: 'group',
      actualStartingTime: '2019-08-14T12:55:50.913Z',
      actualClosingTime: '2019-08-14T12:56:04.364Z'
    },
    {
      _id: 'cjzb9cktv000301rs9zy7ec8z',
      length: 5,
      plane: 3,
      startTime: 16,
      title: 'Debrief',
      activityType: 'ac-gallery',
      configVersion: 1,
      data: { expand: true, showUserName: true },
      participationMode: '{{participationMode}}',
      actualStartingTime: '2019-08-14T12:56:04.700Z'
    }
  ],
  operators: [
    {
      _id: 'cjzb9cktw000501rs54w21zo0',
      time: 14.551520190228437,
      type: 'product',
      y: 235,
      operatorType: 'op-aggregate',
      title: 'Aggregate',
      data: {},
      configVersion: 1
    },
    {
      _id: 'cjzb9cktw000601rsba115oxk',
      time: 6.318460252776316,
      type: 'social',
      y: 197,
      operatorType: 'op-create-groups',
      title: 'Create groups',
      data: {
        groupnumber: true,
        globalnum: '{{numGroups}}',
        grouping: 'group'
      },
      configVersion: 1
    },
    {
      _id: 'cjzb9cktw000701rsc36th9nv',
      time: 8.733459357277887,
      type: 'product',
      y: 73,
      operatorType: 'op-social-config',
      title: 'Social->config',
      data: {
        socialAttribute: 'group',
        path: 'instructions',
        provideDefault: true,
        defaultValue: 'Instructions',
        matchings: '{{matchings}}'
      },
      configVersion: 1
    }
  ],
  connections: [
    {
      _id: 'cjzb9cktw000801rs6dpxc1x3',
      source: { id: 'cjzb9cktw000501rs54w21zo0', type: 'operator' },
      target: { id: 'cjzb9cktv000301rs9zy7ec8z', type: 'activity' }
    },
    {
      _id: 'cjzb9cktw000901rs3ap43kp1',
      source: { id: 'cjzb9cktw000601rsba115oxk', type: 'operator' },
      target: { id: 'cjzb9cktv000201rs6r5k65du', type: 'activity' }
    },
    {
      _id: 'cjzb9cktw000a01rse4c744us',
      source: { id: 'cjzb9cktv000201rs6r5k65du', type: 'activity' },
      target: { id: 'cjzb9cktw000501rs54w21zo0', type: 'operator' }
    },
    {
      _id: 'cjzb9cktw000b01rs3bnc53jc',
      source: { id: 'cjzb9cktw000601rsba115oxk', type: 'operator' },
      target: { id: 'cjzb9cktw000701rsc36th9nv', type: 'operator' }
    },
    {
      _id: 'cjzb9cktw000c01rsg2xp59ek',
      source: { id: 'cjzb9cktw000701rsc36th9nv', type: 'operator' },
      target: { id: 'cjzb9cktv000201rs6r5k65du', type: 'activity' }
    }
  ]
};
