'use strict';

const { exec } = require('child_process');

module.exports = function tdmkill(mod) {
  function isRunning(query) {
    return new Promise(function (resolve, reject) {
      const platform = process.platform;
      let cmd = '';
      switch (platform) {
        case 'win32':
          cmd = `tasklist`;
          break;
        //case 'darwin' : cmd = `ps -ax | grep ${query}`; break;
        //case 'linux' : cmd = `ps -A`; break;
        default:
          break;
      }
      if (cmd === '' || query === '') {
        resolve(false);
      }
      exec(cmd, function (err, stdout, stderr) {
        resolve(stdout.toLowerCase().indexOf(query.toLowerCase()) > -1);
      });
    });
  }

  function killProc() {
    return new Promise(function (resolve, reject) {
      exec(`taskkill /F /IM Tera.DamageMeter.API.exe /T`, (err, stdout, stderr) => {
        if (err) {
          reject(err);
        }
        resolve(stdout.toLowerCase());
      });
    });
  }

  function testfunc() {
    isRunning('Tera.DamageMeter.API.exe').then((param) => console.log(param));
  }

  mod.command.add('tdm', {
    $none: testfunc,
    kill: killProc,
  });

  mod.hook('S_LOAD_TOPO', 3, (event) => {
    //
  });
};

//Tera.DamageMeter.API.exe
