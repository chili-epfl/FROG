const fs = require('fs');
const rimraf = require('rimraf');

rimraf.sync('./frog/public/clientFiles');
fs.mkdirSync('./frog/public/clientFiles');
if (fs.existsSync('./op')) {
  fs.readdirSync('./op').forEach(x => {
    if (fs.existsSync(`./op/${x}/clientFiles`)) {
      fs.symlinkSync(
        `./../../../op/${x}/clientFiles`,
        `./frog/public/clientFiles/${x}`
      );
    }
  });
}
if (fs.existsSync('./ac')) {
  fs.readdirSync('./ac').forEach(x => {
    if (fs.existsSync(`./ac/${x}/clientFiles`)) {
      fs.symlinkSync(
        `./../../../ac/${x}/clientFiles`,
        `./frog/public/clientFiles/${x}`
      );
    }
  });
}
fs.readdirSync('./frog/imports/internalActivities').forEach(x => {
  if (fs.existsSync(`./frog/imports/internalActivities/${x}/clientFiles`)) {
    fs.symlinkSync(
      `./../../../frog/imports/internalActivities/${x}/clientFiles`,
      `./frog/public/clientFiles/${x}`
    );
  }
});
if (fs.existsSync(`./frog-utils/clientFiles`)) {
  fs.symlinkSync(
    `./../../../frog-utils/clientFiles`,
    `./frog/public/clientFiles/frog-utils`
  );
}
