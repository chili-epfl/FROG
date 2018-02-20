import { join } from 'path';
import { readFileSync } from 'fs';
import { inMemoryReactive } from 'frog-utils';

import dashboard from '../Dashboard';

const logs = readFileSync(join(__dirname, 'logs.json'), 'utf8')
  .trim()
  .split('\n')
  .map(x => JSON.parse(x))
  .map(x => ({ ...x, timestamp: new Date(x.timestamp['$date']) }));

const getdoc = () => inMemoryReactive(dashboard.initData);
const activity = {
  _id: 'actid',
  activityType: 'ac-stroop',
  actualStartingTime: new Date('2018-02-19T08:15:19.428Z')
};

test('Merge one', () => {
  getdoc().then(res => {
    const { data, dataFn } = res;
    logs.forEach(x => {
      dashboard.mergeLog(data.data, dataFn, x, activity);
    });
    expect(data.data).toEqual({
      consistent: {
        correct: { count: 107, time: 221514 },
        wrong: { count: 9, time: 39229 }
      },
      inconsistent: {
        correct: { count: 101, time: 224444 },
        wrong: { count: 13, time: 51255 }
      },
      progress: {
        u8dZtnrtMBy9AYzXC: 1,
        G4TQn6q5Qfiaaub74: 1,
        kYFL4RtPNz89XaFPN: 1,
        WHhqbEoSojg5xvdjY: 1,
        SeEQ2ypvR5eh3tYq6: 1,
        '4xqdRzu9YTdqnR8mn': 1,
        WSsnZfuX8ai3XGiqi: 1,
        fLvGabbpRDdPibZeR: 1,
        DRjdDKm8PcH3nnPKw: 1,
        sGpLPtPAisiktjkSr: 1,
        zwDjNmdvqQ9zGvATk: 1,
        yW5LyMHQiYeFy2AN4: 0.6
      },
      timing: [
        [0, 0, 0],
        [15, 0.15, 0],
        [20, 0.25, 0],
        [25, 0.35, 0],
        [30, 0.55, 0],
        [35, 0.7500000000000002, 0],
        [40, 1.0500000000000005, 0],
        [45, 1.3500000000000005, 0],
        [50, 1.7000000000000006, 0],
        [55, 1.9500000000000008, 0],
        [60, 2.3, 0],
        [65, 2.6499999999999986, 0],
        [70, 2.9499999999999975, 0],
        [75, 3.2499999999999964, 1],
        [80, 3.5499999999999954, 1],
        [85, 3.7999999999999945, 1],
        [90, 3.999999999999994, 2],
        [95, 4.149999999999993, 2],
        [100, 4.299999999999993, 2],
        [105, 4.449999999999992, 2],
        [110, 4.699999999999991, 3],
        [115, 5.04999999999999, 4],
        [120, 5.1999999999999895, 4],
        [125, 5.549999999999988, 4],
        [130, 5.849999999999987, 4],
        [135, 6.249999999999986, 5],
        [140, 6.5999999999999845, 5],
        [145, 6.999999999999983, 5],
        [150, 7.399999999999982, 5],
        [155, 7.89999999999998, 5],
        [160, 8.249999999999982, 5],
        [165, 8.699999999999989, 5],
        [170, 9.099999999999994, 5],
        [175, 9.399999999999999, 6],
        [180, 9.850000000000005, 7],
        [185, 10.100000000000009, 7],
        [190, 10.25000000000001, 7],
        [195, 10.600000000000016, 8],
        [200, 10.85000000000002, 10],
        [205, 10.95000000000002, 10],
        [210, 11.050000000000022, 10],
        [215, 11.150000000000023, 11],
        [225, 11.250000000000025, 11],
        [230, 11.300000000000026, 11],
        [235, 11.400000000000027, 11],
        [240, 11.450000000000028, 11],
        [245, 11.500000000000028, 11],
        [250, 11.55000000000003, 11],
        [255, 11.60000000000003, 11]
      ],
      scores: {
        u8dZtnrtMBy9AYzXC: {
          score: [20, -45314],
          timestamp: '2018-02-19T08:16:29.448Z'
        },
        G4TQn6q5Qfiaaub74: {
          score: [15, -62404],
          timestamp: '2018-02-19T08:17:08.652Z'
        },
        kYFL4RtPNz89XaFPN: {
          score: [15, -52862],
          timestamp: '2018-02-19T08:17:11.978Z'
        },
        WHhqbEoSojg5xvdjY: {
          score: [20, -26147],
          timestamp: '2018-02-19T08:16:46.545Z'
        },
        SeEQ2ypvR5eh3tYq6: {
          score: [17, -53409],
          timestamp: '2018-02-19T08:17:31.222Z'
        },
        '4xqdRzu9YTdqnR8mn': {
          score: [19, -52268],
          timestamp: '2018-02-19T08:18:18.493Z'
        },
        WSsnZfuX8ai3XGiqi: {
          score: [20, -33725],
          timestamp: '2018-02-19T08:18:10.000Z'
        },
        fLvGabbpRDdPibZeR: {
          score: [20, -45553],
          timestamp: '2018-02-19T08:18:32.826Z'
        },
        DRjdDKm8PcH3nnPKw: {
          score: [18, -46782],
          timestamp: '2018-02-19T08:18:34.632Z'
        },
        sGpLPtPAisiktjkSr: {
          score: [19, -51124],
          timestamp: '2018-02-19T08:18:51.645Z'
        },
        zwDjNmdvqQ9zGvATk: {
          score: [20, -32381],
          timestamp: '2018-02-19T08:18:38.028Z'
        },
        yW5LyMHQiYeFy2AN4: {
          score: [7, -40761],
          timestamp: '2018-02-19T08:19:32.960Z'
        }
      }
    });
  });
});
