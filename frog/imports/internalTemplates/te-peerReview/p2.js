export default {
  graph: {
    _id: 'cjxllw3sl000168ixh1qrnsht',
    name: '#Peer review    (5)',
    ownerId: 'NqjebGBP8qbpQrYev',
    createdAt: '2019-07-02T09:24:54.453Z',
    graphVersion: 2,
    broken: false,
    duration: 60
  },
  activities: [
    {
      _id: 'cjxllw3sm000268ixoyqypn7e',
      length: 5,
      plane: 2,
      startTime: 7,
      title: 'Rich text',
      activityType: 'li-richText',
      configVersion: 1,
      data: {
        instructions: '{{instructions}}',
        allowEditing: true,
        openIncomingInEdit: true,
        liTypeEditor: 'li-richText'
      },
      groupingKey: 'group',
      actualStartingTime: '2019-07-02T09:38:59.227Z',
      actualClosingTime: '2019-07-02T09:39:09.228Z'
    },
    {
      _id: 'cjxllw3sm000368ixs8mql45b',
      length: 5,
      plane: 2,
      startTime: 19,
      title: 'Gallery',
      activityType: 'ac-gallery',
      configVersion: 1,
      data: { openEdit: true, expand: true, showUserName: true },
      groupingKey: 'group',
      actualStartingTime: '2019-07-02T09:39:09.347Z',
      actualClosingTime: '2019-07-02T09:39:17.896Z'
    },
    {
      _id: 'cjxllw3sm000468ixs0m7cexz',
      length: 5,
      plane: 2,
      startTime: 27,
      title: 'Gallery',
      activityType: 'ac-gallery',
      configVersion: 1,
      data: { showUserName: true },
      groupingKey: 'group',
      actualStartingTime: '2019-07-02T09:39:17.942Z',
      actualClosingTime: '2019-07-02T09:39:25.303Z'
    },
    {
      _id: 'cjxllw3sm000568ixszzq2tim',
      length: 5,
      plane: 2,
      startTime: 27,
      title: 'Rich text',
      activityType: 'li-richText',
      configVersion: 1,
      data: {
        allowEditing: true,
        openIncomingInEdit: true,
        liTypeEditor: 'li-richText',
        instructions: '{{reviseInstructions}}'
      },
      groupingKey: 'group',
      actualStartingTime: '2019-07-02T09:39:17.964Z',
      actualClosingTime: '2019-07-02T09:39:25.303Z'
    },
    {
      _id: 'cjxllw3sm000668ixei1vz74r',
      length: 5,
      plane: 3,
      startTime: 37,
      title: 'Gallery',
      activityType: 'ac-gallery',
      configVersion: 1,
      data: { expand: true, showUserName: true },
      participationMode: 'projector',
      actualStartingTime: '2019-07-02T09:39:25.336Z'
    },
    {
      _id: 'cjxllw3sm000768ixs64fr0b2',
      length: 5,
      plane: 3,
      startTime: 2,
      title: 'Text Component',
      activityType: 'ac-text',
      configVersion: 1,
      data: {
        text: '<p>Please wait until the teacher begins the activity</p>'
      },
      actualStartingTime: '2019-07-02T09:26:55.280Z',
      actualClosingTime: '2019-07-02T09:38:59.136Z'
    }
  ],
  operators: [
    {
      _id: 'cjxllw3sm000868ixxwrjs8k8',
      time: 14.342281879194639,
      type: 'product',
      y: 240,
      operatorType: 'op-wrap-peer-review',
      title: 'Wrap for peer-review',
      data: {
        responseLIType: 'li-richText',
        prompt: '{{reviewPrompt}}',
        distribute: true,
        count: '{{reviewCount}}'
      },
      configVersion: 1
    },
    {
      _id: 'cjxllw3sm000968ix98fmz9ui',
      time: 23.73825503355705,
      type: 'product',
      y: 276,
      operatorType: 'op-returnReviews',
      title: 'Return reviews',
      data: {},
      configVersion: 1
    },
    {
      _id: 'cjxllw3sm000a68ix8y6rvz70',
      time: 32.15100671140942,
      type: 'product',
      y: 236,
      operatorType: 'op-aggregate',
      title: 'Aggregate',
      data: {},
      configVersion: 1
    },
    {
      _id: 'cjxllw3sm000b68ix2e32fg6d',
      time: 8.590604026845638,
      type: 'social',
      y: 125,
      operatorType: 'op-create-groups',
      title: 'Create groups',
      data: { groupsize: 2, strategy: 'minimum', grouping: 'group' },
      configVersion: 1
    }
  ],
  connections: [
    {
      _id: 'cjxllw3sm000c68ix8dkn5ips',
      source: { id: 'cjxllw3sm000268ixoyqypn7e', type: 'activity' },
      target: { id: 'cjxllw3sm000868ixxwrjs8k8', type: 'operator' }
    },
    {
      _id: 'cjxllw3sm000d68ixesy5xan1',
      source: { id: 'cjxllw3sm000868ixxwrjs8k8', type: 'operator' },
      target: { id: 'cjxllw3sm000368ixs8mql45b', type: 'activity' }
    },
    {
      _id: 'cjxllw3sm000e68ixv3satzr1',
      source: { id: 'cjxllw3sm000968ix98fmz9ui', type: 'operator' },
      target: { id: 'cjxllw3sm000468ixs0m7cexz', type: 'activity' }
    },
    {
      _id: 'cjxllw3sm000f68ix1g1qn7bl',
      source: { id: 'cjxllw3sm000368ixs8mql45b', type: 'activity' },
      target: { id: 'cjxllw3sm000968ix98fmz9ui', type: 'operator' }
    },
    {
      _id: 'cjxllw3sm000g68ixbwbapw8g',
      source: { id: 'cjxllw3sm000268ixoyqypn7e', type: 'activity' },
      target: { id: 'cjxllw3sm000568ixszzq2tim', type: 'activity' }
    },
    {
      _id: 'cjxllw3sm000h68ixbd34jkn1',
      source: { id: 'cjxllw3sm000568ixszzq2tim', type: 'activity' },
      target: { id: 'cjxllw3sm000a68ix8y6rvz70', type: 'operator' }
    },
    {
      _id: 'cjxllw3sm000i68ixf25o8urv',
      source: { id: 'cjxllw3sm000a68ix8y6rvz70', type: 'operator' },
      target: { id: 'cjxllw3sm000668ixei1vz74r', type: 'activity' }
    },
    {
      _id: 'cjxllw3sn000j68ixtz1jkhhr',
      source: { id: 'cjxllw3sm000b68ix2e32fg6d', type: 'operator' },
      target: { id: 'cjxllw3sm000268ixoyqypn7e', type: 'activity' }
    },
    {
      _id: 'cjxllw3sn000k68ixvl2qm8lt',
      source: { id: 'cjxllw3sm000b68ix2e32fg6d', type: 'operator' },
      target: { id: 'cjxllw3sm000368ixs8mql45b', type: 'activity' }
    },
    {
      _id: 'cjxllw3sn000l68ixk66oawjn',
      source: { id: 'cjxllw3sm000b68ix2e32fg6d', type: 'operator' },
      target: { id: 'cjxllw3sm000468ixs0m7cexz', type: 'activity' }
    },
    {
      _id: 'cjxllw3sn000m68ixbu1psifx',
      source: { id: 'cjxllw3sm000b68ix2e32fg6d', type: 'operator' },
      target: { id: 'cjxllw3sm000568ixszzq2tim', type: 'activity' }
    }
  ]
};
