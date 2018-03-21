const fs = require('fs');

const users = {};
const userId = user => {
  if (!users[user]) {
    users[user] = Object.keys(users).length;
  }
  return users[user];
};
const logObj = log => {
  if (log[0] === 'timestamp') {
    return;
  }
  return {
    type: log[8],
    itemId: log[9],
    activityId: log[4],
    value: log[10] ? JSON.parse(log[10]) : undefined,
    payload: log[11] ? JSON.parse(log[11]) : undefined,
    sessionId: '1',
    userId: userId(log[2]),
    instanceId: log[3],
    timestamp: log[0]
  };
};
const logstring = fs.readFileSync('log.tsv', 'utf-8');
const id = process.argv[2] && process.argv[2].trim();
const logs = logstring
  .split('\n')
  .map(x => x.split('\t'))
  .filter(x => x[4] === id)
  .map(x => logObj(x))
  .forEach(x => console.log(JSON.stringify(x)));
