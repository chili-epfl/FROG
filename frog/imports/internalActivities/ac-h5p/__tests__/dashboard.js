import fs from 'fs';

const state = {};

const processLog = log => {
  if (log.verb && log.verb.id === 'http://adlnet.gov/expapi/verbs/answered') {
    if (!state[log.object.id]) {
      state[log.object.id] = {
        name: log.object.definition.name['en-US'],
        students: []
      };
    }
    state[log.object.id].students[log.userId] = log.result;
  }
};

const logsRaw = fs.readFileSync(
  '/Users/stian/src/frog/frog/imports/internalActivities/ac-h5p/__tests__/logs.json'
);
const logs = JSON.parse(logsRaw).logs.map(x => ({
  ...JSON.parse(x.payload.msg),
  userId: x.userId
}));
console.log(JSON.stringify(logs, null, 2));
logs.forEach(x => processLog(x));
console.log(JSON.stringify(state, null, 2));
console.log(state);
console.log(JSON.stringify(state));
