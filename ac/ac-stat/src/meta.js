// @flow

export default {
  name: 'Statistical intuition',
  shortDesc: 'Allow the student to see various plots of some data',
  description:
    'Allow the student to see various plots of data chosen by the teacher or the student',
  exampleData: [
    {
      title: '1 trace 1 axis',
      config: { title: 'Graph1', plotType: 'all' },
      data: [
        { trace: 'dataset1', size: 1.8 },
        { trace: 'dataset1', size: 1.6 },
        { trace: 'dataset1', size: 1.6 },
        { trace: 'dataset1', size: 1.65 },
        { trace: 'dataset1', size: 1.9 },
        { trace: 'dataset1', size: 1.62 },
        { trace: 'dataset1', size: 1.76 },
        { trace: 'dataset1', size: 1.74 },
        { trace: 'dataset1', size: 1.82 },
        { trace: 'dataset1', size: 1.7 }
      ]
    },
    {
      title: '1 trace 2 axis',
      config: { title: 'Graph2', plotType: 'all' },
      data: [
        { trace: 'dataset1', size: 1.5, sex: 'F' },
        { trace: 'dataset1', size: 1.54, sex: 'F' },
        { trace: 'dataset1', size: 1.79, sex: 'M' },
        { trace: 'dataset1', size: 1.85, sex: 'M' },
        { trace: 'dataset1', size: 1.64, sex: 'M' },
        { trace: 'dataset1', size: 1.72, sex: 'F' },
        { trace: 'dataset1', size: 1.76, sex: 'M' },
        { trace: 'dataset1', size: 1.74, sex: 'M' },
        { trace: 'dataset1', size: 1.82, sex: 'F' },
        { trace: 'dataset1', size: 1.7, sex: 'F' }
      ]
    },
    {
      title: '2 trace 1 axis',
      config: { title: 'Graph3', plotType: 'all' },
      data: [
        { trace: 'dataset1', size: 1.8 },
        { trace: 'dataset1', size: 1.6 },
        { trace: 'dataset1', size: 1.6 },
        { trace: 'dataset1', size: 1.65 },
        { trace: 'dataset1', size: 1.9 },
        { trace: 'dataset2', size: 1.62 },
        { trace: 'dataset2', size: 1.76 },
        { trace: 'dataset2', size: 1.74 },
        { trace: 'dataset2', size: 1.82 },
        { trace: 'dataset2', size: 1.7 },
        { trace: 'dataset2', size: 1.5 },
        { trace: 'dataset1', size: 1.54 },
        { trace: 'dataset2', size: 1.79 },
        { trace: 'dataset1', size: 1.85 },
        { trace: 'dataset2', size: 1.99 }
      ]
    }
  ]
};
