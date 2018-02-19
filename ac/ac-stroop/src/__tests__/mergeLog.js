import { join } from 'path';
import { readFileSync } from 'fs';
import { inMemoryReactive } from 'frog-utils';
import util from 'util';

import dashboard from '../Dashboard';

const logs = readFileSync(join(__dirname, 'logs.json'), 'utf8')
  .trim()
  .split('\n')
  .map(x => JSON.parse(x));

const getdoc = () => inMemoryReactive(dashboard.initData);
const activity = { _id: 'actid', activityType: 'ac-stroop' };

test('Merge one', () => {
  getdoc().then(res => {
    const { data, dataFn } = res;
    logs.forEach(x => dashboard.mergeLog(data.data, dataFn, x, activity));
    expect(data.data).toEqual({
      consistent: {
        correct: { count: 107, time: 221514 },
        wrong: { count: 9, time: 39229 }
      },
      inconsistent: {
        correct: { count: 101, time: 224444 },
        wrong: { count: 13, time: 51255 }
      },
      progress: {},
      timing: [[0, 0, 0]],
      scores: {
        u8dZtnrtMBy9AYzXC: {
          score: [20, -45314],
          timestamp: { $date: '2018-02-19T08:16:29.448Z' }
        },
        G4TQn6q5Qfiaaub74: {
          score: [15, -62404],
          timestamp: { $date: '2018-02-19T08:17:08.652Z' }
        },
        kYFL4RtPNz89XaFPN: {
          score: [15, -52862],
          timestamp: { $date: '2018-02-19T08:17:11.978Z' }
        },
        WHhqbEoSojg5xvdjY: {
          score: [20, -26147],
          timestamp: { $date: '2018-02-19T08:16:46.545Z' }
        },
        SeEQ2ypvR5eh3tYq6: {
          score: [17, -53409],
          timestamp: { $date: '2018-02-19T08:17:31.222Z' }
        },
        '4xqdRzu9YTdqnR8mn': {
          score: [19, -52268],
          timestamp: { $date: '2018-02-19T08:18:18.493Z' }
        },
        WSsnZfuX8ai3XGiqi: {
          score: [20, -33725],
          timestamp: { $date: '2018-02-19T08:18:10.000Z' }
        },
        fLvGabbpRDdPibZeR: {
          score: [20, -45553],
          timestamp: { $date: '2018-02-19T08:18:32.826Z' }
        },
        DRjdDKm8PcH3nnPKw: {
          score: [18, -46782],
          timestamp: { $date: '2018-02-19T08:18:34.632Z' }
        },
        sGpLPtPAisiktjkSr: {
          score: [19, -51124],
          timestamp: { $date: '2018-02-19T08:18:51.645Z' }
        },
        zwDjNmdvqQ9zGvATk: {
          score: [20, -32381],
          timestamp: { $date: '2018-02-19T08:18:38.028Z' }
        },
        yW5LyMHQiYeFy2AN4: {
          score: [7, -40761],
          timestamp: { $date: '2018-02-19T08:19:32.960Z' }
        }
      }
    });
  });
});
