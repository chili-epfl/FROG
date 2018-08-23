// @flow

export default {
  name: 'Statistical intuition',
  shortDesc: 'Allow the student to see various plots of some data',
  description:
    'Allow the student to see various plots of data chosen by the teacher or the student',
  exampleData: [
    {
      title: '1 point',
      config: { title: 'Graph2', plotType: 'all' },
      data: { trace: '1', x: 20, y: 30 }
    },
    {
      title: '2 traces',
      config: { title: 'Graph3', plotType: 'all' },
      data: [
        { trace: 'a', x: 1, y: 30 },
        { trace: 'a', x: 2, y: 20 },
        { trace: 'a', x: 3, y: 30 },
        { trace: 'a', x: 4, y: 20 },
        { trace: 'a', x: 5, y: 30 },
        { trace: 'a', x: 6, y: 20 },
        { trace: 'a', x: 7, y: 30 },
        { trace: 'b', x: 1, y: 3 },
        { trace: 'b', x: 2, y: 5 },
        { trace: 'b', x: 3, y: 7 },
        { trace: 'b', x: 4, y: 9 },
        { trace: 'b', x: 5, y: 11 },
        { trace: 'b', x: 6, y: 12 },
        { trace: 'b', x: 3, y: 12 },
        { trace: 'b', x: 5, y: 2 },
        { trace: 'b', x: 7, y: 13 }
      ]
    },
    {
      title: '1 trace 1 axis',
      config: { title: 'Graph4', plotType: 'all' },
      data: [
        { trace: 'size', x: 1.8 },
        { trace: 'size', x: 1.6 },
        { trace: 'size', x: 1.6 },
        { trace: 'size', x: 1.65 },
        { trace: 'size', x: 1.9 },
        { trace: 'size', x: 1.62 },
        { trace: 'size', x: 1.76 },
        { trace: 'size', x: 1.74 },
        { trace: 'size', x: 1.82 },
        { trace: 'size', x: 1.7 }
      ]
    }
  ]
};
