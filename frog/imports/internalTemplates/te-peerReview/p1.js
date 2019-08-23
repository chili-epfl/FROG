export default {
  graph: {
    _id: 'cjxlll7f4003jg5ixog2uvq71',
    name: '#Peer review   (4)',
    ownerId: 'NqjebGBP8qbpQrYev',
    createdAt: '2019-07-02T09:16:25.936Z',
    graphVersion: 2,
    broken: false,
    duration: 60
  },
  activities: [
    {
      _id: 'cjxlll7f4003kg5ixechs7pbf',
      length: 5,
      plane: 1,
      startTime: 5,
      title: 'Rich text',
      activityType: 'li-richText',
      configVersion: 1,
      data: {
        instructions: '{{instructions}}',
        allowEditing: true,
        openIncomingInEdit: true,
        liTypeEditor: 'li-richText'
      },
      actualStartingTime: '2019-07-02T09:16:27.522Z'
    },
    {
      _id: 'cjxlll7f4003lg5ixzgwhqz8a',
      length: 5,
      plane: 1,
      startTime: 16,
      title: 'Gallery',
      activityType: 'ac-gallery',
      configVersion: 1,
      data: { openEdit: true, expand: true, showUserName: true }
    },
    {
      _id: 'cjxlll7f4003mg5ix529lxkwt',
      length: 5,
      plane: 1,
      startTime: 24,
      title: 'Gallery',
      activityType: 'ac-gallery',
      configVersion: 1,
      data: { showUserName: true }
    },
    {
      _id: 'cjxlll7f4003ng5ixuiiiecl2',
      length: 5,
      plane: 1,
      startTime: 24,
      title: 'Rich text',
      activityType: 'li-richText',
      configVersion: 1,
      data: {
        allowEditing: true,
        openIncomingInEdit: true,
        liTypeEditor: 'li-richText',
        instructions: '{{reviseInstructions}}'
      }
    },
    {
      _id: 'cjxlll7f4003og5ixjfqil8id',
      length: 5,
      plane: 3,
      startTime: 34,
      title: 'Gallery',
      activityType: 'ac-gallery',
      configVersion: 1,
      data: { expand: true, showUserName: true },
      participationMode: '{{participationMode}}'
    }
  ],
  operators: [
    {
      _id: 'cjxlll7f4003pg5ix4vlr5sjh',
      time: 13.020134228187919,
      type: 'product',
      y: 355,
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
      _id: 'cjxlll7f4003qg5ixyetvrk3n',
      time: 24.697986577181208,
      type: 'product',
      y: 343,
      operatorType: 'op-returnReviews',
      title: 'Return reviews',
      data: {},
      configVersion: 1
    },
    {
      _id: 'cjxlll7f4003rg5ixwimzj7ze',
      time: 31.5,
      type: 'product',
      y: 350,
      operatorType: 'op-aggregate',
      title: 'Aggregate',
      data: {},
      configVersion: 1
    }
  ],
  connections: [
    {
      _id: 'cjxlll7f4003sg5ix6g0x3ubl',
      source: { id: 'cjxlll7f4003kg5ixechs7pbf', type: 'activity' },
      target: { id: 'cjxlll7f4003pg5ix4vlr5sjh', type: 'operator' }
    },
    {
      _id: 'cjxlll7f4003tg5ixvmz0fxk5',
      source: { id: 'cjxlll7f4003pg5ix4vlr5sjh', type: 'operator' },
      target: { id: 'cjxlll7f4003lg5ixzgwhqz8a', type: 'activity' }
    },
    {
      _id: 'cjxlll7f5003ug5ixxifjhxfp',
      source: { id: 'cjxlll7f4003qg5ixyetvrk3n', type: 'operator' },
      target: { id: 'cjxlll7f4003mg5ix529lxkwt', type: 'activity' }
    },
    {
      _id: 'cjxlll7f5003vg5ixui38wqly',
      source: { id: 'cjxlll7f4003lg5ixzgwhqz8a', type: 'activity' },
      target: { id: 'cjxlll7f4003qg5ixyetvrk3n', type: 'operator' }
    },
    {
      _id: 'cjxlll7f5003wg5ix7ynkit5l',
      source: { id: 'cjxlll7f4003kg5ixechs7pbf', type: 'activity' },
      target: { id: 'cjxlll7f4003ng5ixuiiiecl2', type: 'activity' }
    },
    {
      _id: 'cjxlll7f5003xg5ixje92aax0',
      source: { id: 'cjxlll7f4003ng5ixuiiiecl2', type: 'activity' },
      target: { id: 'cjxlll7f4003rg5ixwimzj7ze', type: 'operator' }
    },
    {
      _id: 'cjxlll7f5003yg5ixok49adtt',
      source: { id: 'cjxlll7f4003rg5ixwimzj7ze', type: 'operator' },
      target: { id: 'cjxlll7f4003og5ixjfqil8id', type: 'activity' }
    }
  ]
};
