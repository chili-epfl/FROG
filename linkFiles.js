const rimraf = require('rimraf');
const fs = require('fs');

rimraf.sync('../frog/frog/public/clientFiles');
fs.mkdirSync('../frog/frog/public/clientFiles');
fs.readdirSync('../frog/op').forEach(x => {
  if (fs.existsSync(`../frog/op/${x}/clientFiles`)) {
    fs.symlinkSync(
      `../../../op/${x}/clientFiles`,
      `../frog/frog/public/clientFiles/${x}`
    );
  }
});
fs.readdirSync('../frog/ac').forEach(x => {
  if (fs.existsSync(`../frog/ac/${x}/clientFiles`)) {
    fs.symlinkSync(
      `../../../ac/${x}/clientFiles`,
      `../frog/frog/public/clientFiles/${x}`
    );
  }
});
