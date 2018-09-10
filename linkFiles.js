const rimraf = require('rimraf');
const fs = require('fs');

rimraf.sync('./frog/public/clientFiles');
fs.mkdirSync('./frog/public/clientFiles');
fs.readdirSync('./op').forEach(x => {
  if (fs.existsSync(`./op/${x}/clientFiles`)) {
    fs.symlinkSync(
      `./../../../op/${x}/clientFiles`,
      `./frog/public/clientFiles/${x}`
    );
  }
});
fs.readdirSync('./ac').forEach(x => {
  if (fs.existsSync(`./ac/${x}/clientFiles`)) {
    fs.symlinkSync(
      `./../../../ac/${x}/clientFiles`,
      `./frog/public/clientFiles/${x}`
    );
  }
});
