'use strict';

const { exec } = require('child_process');

module.exports = function tdmkill(mod) {
  const { command, settings } = mod;

  function isRunning(query) {
    return new Promise(function (resolve, reject) {
      const platform = process.platform;
      let cmd = '';
      switch (platform) {
        case 'win32':
          cmd = `tasklist`;
          break;
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
          reject(false);
        }
        resolve(true);
      });
    });
  }

  function testfunc() {
    if (!settings.enabled) {
      command.message('Module tdm-kill disabled by settings, type tdm in toolbox chat to enable.');
      return;
    }
    isRunning('Tera.DamageMeter.API.exe').then((param) => {
      if (param) {
        console.log('Tera Damage Meter is running');
        killProc().then((ret) => {
          command.message(
            ret ? 'Tera Damage Meter process killed successfully' : "Can't to kill Tera Damage Meter process"
          );
        });
      } else {
        command.message('Tera Damage Meter is not running');
      }
    });
  }

  command.add('tdm', () => {
    settings.enabled = !settings.enabled;
    command.message('tdm-kill: ' + (settings.enabled ? 'enabled.' : 'disabled.'));
    if (settings.enabled) {
      testfunc();
    }
  });

  mod.hook('S_LOAD_TOPO', 3, (event) => {
    testfunc();
  });
};
