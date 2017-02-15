export const mixedJigsaw = {
  graphs: [{ _id: 'G1', name: 'Mixed Jigsaw' }],
  activities: [
    {
      _id: 'A1',
      title: 'Group Talk',
      graphId: 'G1',
      startTime: 0,
      length: 5,
      plane: 2,
      activityType: 'ac-jigsaw',
      data: {
        title: 'A1',
        roles: 'French,English,German',
        text: 'Salut,Hi,Hallo',
        groupBy: 'group'
      }
    },
    {
      _id: 'A2',
      title: 'Role Talk',
      graphId: 'G1',
      startTime: 5,
      length: 5,
      plane: 2,
      activityType: 'ac-jigsaw',
      data: {
        title: 'A2',
        roles: 'French,English,German',
        text: "Les maths c'est bien,Maths are good,Die Mathematik ist gut",
        groupBy: 'role'
      }
    },
    {
      _id: 'A3',
      title: 'Lecture',
      graphId: 'G1',
      startTime: 10,
      length: 5,
      plane: 1,
      activityType: 'ac-text',
      data: { title: 'A3', text: 'You are on activity A3' }
    },
    {
      _id: 'A4',
      title: 'Mixed Group Talk',
      graphId: 'G1',
      startTime: 15,
      length: 5,
      plane: 2,
      activityType: 'ac-jigsaw',
      data: {
        title: 'A4',
        roles: 'French,English,German',
        text: 'Salut,Bye,Tschüss',
        groupBy: 'group'
      }
    }
  ],
  operators: [
    {
      _id: 'O1',
      name: 'JigsawOp',
      graphId: 'G1',
      type: 'social',
      operatorType: 'op-jigsaw',
      time: 2,
      y: 50
    },
    {
      _id: 'O2',
      name: 'MixJigOp',
      graphId: 'G1',
      type: 'social',
      operatorType: 'op-jigsaw',
      time: 14,
      y: 50
    }
  ],
  connections: [
    {
      _id: 'C1',
      source: { type: 'operator', id: 'O1' },
      target: { type: 'activity', id: 'A1' },
      graphId: 'G1'
    },
    {
      _id: 'C2',
      source: { type: 'operator', id: 'O1' },
      target: { type: 'activity', id: 'A2' },
      graphId: 'G1'
    },
    {
      _id: 'C3',
      source: { type: 'operator', id: 'O1' },
      target: { type: 'operator', id: 'O2' },
      graphId: 'G1'
    },
    {
      _id: 'C4',
      source: { type: 'operator', id: 'O2' },
      target: { type: 'activity', id: 'A4' },
      graphId: 'G1'
    }
  ]
};
