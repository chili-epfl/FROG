// mocks fetch by always returning the same file contents
import fs from 'fs';
import path from 'path';

export default url =>
  new Promise((resolve, reject) => {
    const fname = url.includes('empty')
      ? 'apiResponseEmpty.json'
      : 'apiResponse.json';
    fs.readFile(path.join(__dirname, '/', fname), 'utf8', (err, data) => {
      if (err) reject(err);
      const ret = { json: () => JSON.parse(data) };
      resolve(ret);
    });
  });
