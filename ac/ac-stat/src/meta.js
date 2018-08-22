// @flow

export default {
  name: 'Statistical intuition',
  shortDesc: 'Allow the student to see various plots of some data',
  description:
    'Allow the student to see various plots of data chosen by the teacher or the student',
  exampleData: [
    {
      title: 'Random 100 points step 1',
      config: { title: 'Graph2', plotType: 'all' },
      data: { trace: '1', x: 20, y: 30 }
    },
    {
      title: 'log 100 points and linear',
      config: { title: 'Graph3', plotType: 'all' },
      data: [
        { trace: '1', x: 1, y: 30 },
        { trace: '1', x: 2, y: 20 },
        { trace: '1', x: 3, y: 30 },
        { trace: '1', x: 4, y: 20 },
        { trace: '1', x: 5, y: 30 },
        { trace: '1', x: 6, y: 20 },
        { trace: '1', x: 7, y: 30 },
        { trace: '2', x: 1, y: 3 },
        { trace: '2', x: 2, y: 5 },
        { trace: '2', x: 3, y: 7 },
        { trace: '2', x: 4, y: 9 },
        { trace: '2', x: 5, y: 11 },
        { trace: '2', x: 6, y: 12 },
        { trace: '2', x: 7, y: 13 }
      ]
    }
  ]
};
