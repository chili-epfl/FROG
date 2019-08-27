export default {
  graph: {
    _id: 'cjzb8vtjv007t01rs94nyeglf',
    name: 'Student writing',
    ownerId: 'TcCcpfEyr2mjMpzYw',
    createdAt: '2019-08-14T12:42:29.084Z',
    graphVersion: 2,
    broken: false,
    duration: 60,
    templateGraph: true
  },
  activities: [
    {
      _id: 'cjzb8vtjy007u01rsbrmo67fk',
      length: 5,
      plane: 2,
      startTime: 7,
      title: 'Editing text',
      activityType: 'li-richText',
      configVersion: 1,
      data: {
        instructions: '{{instructions}}',
        allowEditing: true,
        openIncomingInEdit: true,
        liTypeEditor: 'li-richText'
      },
      groupingKey: 'group'
    },
    {
      _id: 'cjzb8vtjy007y01rsf2d76ov2',
      length: 5,
      plane: 3,
      startTime: 16,
      title: 'Debrief',
      activityType: 'ac-gallery',
      configVersion: 1,
      data: { expand: true, showUserName: true },
      participationMode: '{{participationMode}}'
    },
    {
      _id: 'cjzb8vtjy007z01rs0oiv3u4v',
      length: 5,
      plane: 3,
      startTime: 2,
      title: 'Waiting message',
      activityType: 'ac-text',
      configVersion: 1,
      data: {
        text: '<p>Please wait until the teacher begins the activity</p>'
      },
      actualStartingTime: '2019-08-14T12:42:29.322Z'
    }
  ],
  operators: [
    {
      _id: 'cjzb8vtjy008201rs8ua481yf',
      time: 14.551520190228437,
      type: 'product',
      y: 235,
      operatorType: 'op-aggregate',
      title: 'Aggregate',
      data: {},
      configVersion: 1
    },
    {
      _id: 'cjzb8vtjy008301rs8w20ejhi',
      time: 6.318460252776316,
      type: 'social',
      y: 197,
      operatorType: 'op-create-groups',
      title: 'Create groups',
      data: {
        groupsize: '{{groupSize}}',
        strategy: 'minimum',
        grouping: 'group'
      },
      configVersion: 1
    }
  ],
  connections: [
    {
      _id: 'cjzb8vtjy008a01rsch2zd8mf',
      source: { id: 'cjzb8vtjy008201rs8ua481yf', type: 'operator' },
      target: { id: 'cjzb8vtjy007y01rsf2d76ov2', type: 'activity' }
    },
    {
      _id: 'cjzb8vtjy008b01rs68tpdn86',
      source: { id: 'cjzb8vtjy008301rs8w20ejhi', type: 'operator' },
      target: { id: 'cjzb8vtjy007u01rsbrmo67fk', type: 'activity' }
    },
    {
      _id: 'cjzb8wlka00023f71xxvkabn0',
      source: { type: 'activity', id: 'cjzb8vtjy007u01rsbrmo67fk' },
      target: { type: 'operator', id: 'cjzb8vtjy008201rs8ua481yf' }
    }
  ]
};
