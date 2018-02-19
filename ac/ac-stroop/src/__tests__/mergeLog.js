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
        [20, 0.24999999999999994, 0],
        [25, 0.34999999999999987, 0],
        [30, 0.5499999999999998, 0],
        [35, 0.7499999999999999, 0],
        [40, 1.05, 0],
        [45, 1.3499999999999999, 0],
        [50, 1.7000000000000002, 0],
        [55, 1.9500000000000002, 0],
        [60, 2.3000000000000007, 0],
        [65, 2.6500000000000004, 0],
        [70, 2.95, 0],
        [75, 3.25, 1],
        [80, 3.55, 1],
        [85, 3.8, 1],
        [90, 3.9999999999999996, 2],
        [95, 4.1499999999999995, 2],
        [100, 4.3, 2],
        [105, 4.449999999999999, 2],
        [110, 4.7, 3],
        [115, 5.05, 4],
        [120, 5.2, 4],
        [125, 5.55, 4],
        [130, 5.85, 4],
        [135, 6.25, 5],
        [140, 6.6, 5],
        [145, 6.999999999999999, 5],
        [150, 7.4, 5],
        [155, 7.900000000000001, 5],
        [160, 8.250000000000007, 5],
        [165, 8.700000000000005, 5],
        [170, 9.100000000000001, 5],
        [175, 9.400000000000004, 6],
        [180, 9.850000000000003, 7],
        [185, 10.100000000000003, 7],
        [190, 10.250000000000005, 7],
        [195, 10.600000000000003, 8],
        [200, 10.850000000000003, 10],
        [205, 10.950000000000005, 10],
        [210, 11.050000000000002, 10],
        [215, 11.150000000000004, 11],
        [225, 11.250000000000004, 11],
        [230, 11.300000000000004, 11],
        [235, 11.400000000000004, 11],
        [240, 11.450000000000003, 11],
        [245, 11.500000000000004, 11],
        [250, 11.550000000000004, 11],
        [255, 11.600000000000003, 11]
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
