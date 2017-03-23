export const mixedJigsaw = {
  graphs: [{ _id: 'mixedJigsawG', name: 'Mixed Jigsaw', duration: 30 }],
  activities: [
    {
      _id: 'mixedJigsawA1',
      title: 'Group Talk',
      graphId: 'mixedJigsawG',
      startTime: 0,
      length: 5,
      plane: 2,
      activityType: 'ac-jigsaw',
      data: {
        title: 'A1',
        roles: 'French,English',
        text: 'Salut,Hi',
        groupBy: 'group'
      }
    },
    {
      _id: 'mixedJigsawA2',
      title: 'Role Talk',
      graphId: 'mixedJigsawG',
      startTime: 5,
      length: 5,
      plane: 2,
      activityType: 'ac-jigsaw',
      data: {
        title: 'A2',
        roles: 'French,English',
        text: "Les maths c'est bien,Maths are good",
        groupBy: 'role'
      }
    },
    {
      _id: 'mixedJigsawA3',
      title: 'Lecture',
      graphId: 'mixedJigsawG',
      startTime: 10,
      length: 5,
      plane: 1,
      activityType: 'ac-text',
      data: { title: 'A3', text: 'You are on activity A3' }
    },
    {
      _id: 'mixedJigsawA4',
      title: 'Mixed Group Talk',
      graphId: 'mixedJigsawG',
      startTime: 15,
      length: 5,
      plane: 2,
      activityType: 'ac-jigsaw',
      data: {
        title: 'A4',
        roles: 'French,English',
        text: 'Salut,Bye',
        groupBy: 'group'
      }
    }
  ],
  operators: [
    {
      _id: 'mixedJigsawO1',
      name: 'JigsawOp',
      graphId: 'mixedJigsawG',
      type: 'social',
      operatorType: 'op-jigsaw',
      data: {
        roles: 'French,English',
        mix: false
      },
      time: 2,
      y: 50
    },
    {
      _id: 'mixedJigsawO2',
      name: 'MixJigOp',
      graphId: 'mixedJigsawG',
      type: 'social',
      operatorType: 'op-jigsaw',
      data: {
        roles: 'French,English',
        mix: true
      },
      time: 14,
      y: 50
    }
  ],
  connections: [
    {
      _id: 'mixedJigsawC1',
      source: { type: 'operator', id: 'mixedJigsawO1' },
      target: { type: 'activity', id: 'mixedJigsawA1' },
      graphId: 'mixedJigsawG'
    },
    {
      _id: 'mixedJigsawC2',
      source: { type: 'operator', id: 'mixedJigsawO1' },
      target: { type: 'activity', id: 'mixedJigsawA2' },
      graphId: 'mixedJigsawG'
    },
    {
      _id: 'mixedJigsawC3',
      source: { type: 'operator', id: 'mixedJigsawO1' },
      target: { type: 'operator', id: 'mixedJigsawO2' },
      graphId: 'mixedJigsawG'
    },
    {
      _id: 'mixedJigsawC4',
      source: { type: 'operator', id: 'mixedJigsawO2' },
      target: { type: 'activity', id: 'mixedJigsawA4' },
      graphId: 'mixedJigsawG'
    }
  ]
};
