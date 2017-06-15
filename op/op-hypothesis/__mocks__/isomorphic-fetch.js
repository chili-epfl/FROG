// mocks fetch by always returning the same file contents
import fs from 'fs';

export default () =>
  new Promise((resolve, reject) => {
    fs.readFile(__dirname + '/apiResponse.json', 'utf8', (err, data) => {
      if (err) reject(err);
      const ret = { json: () => JSON.parse(data) };
      resolve(ret);
    });
  });
