// @flow

const uniformData: any[] = new Array(200).fill().map((_, x) => ({
  trace: ((x % 2) + 1).toString(),
  y: Math.random()
}));

const normalData: any[] = new Array(200).fill().map((_, x) => ({
  trace: 'pseudo-normal',
  x,
  y: new Array(20).fill().reduce(acc => acc + Math.random(), 0) / 20
}));

export default {
  name: 'Plot statistical data',
  shortDesc: 'Allow the student to see various plots of some data',
  description:
    'Allow the student to see various plots of data chosen by the teacher or the student',
  exampleData: [
    {
      title: 'Uniform distribution',
      config: { title: 'Uniform Distribution', plotType: 'all' },
      data: uniformData
    },
    {
      title: 'Normal Distribution',
      config: { title: 'Pseudo-Normal Distribution', plotType: 'all' },
      data: normalData
    }
  ]
};
