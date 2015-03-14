#!/usr/bin/env node

var Liftoff = require('liftoff');
var argv = require('minimist')(process.argv.slice(2));
var path = require('path');
var fs = require('fs');
GLOBAL._ = require('underscore');

var BotdylanCli = new Liftoff({
  name: 'botdylan',
  extensions: require('interpret').jsVariants
});

BotdylanCli.launch({
  cwd: argv.cwd,
  configPath: argv.botdylanfile,
  require: argv.require,
  completion: argv.completion,
  verbose: argv.verbose
}, function(env) {

  argv.dir = argv.dir || env.configBase;

  var command = argv._[0];

  if (argv.v || argv.version) {
    console.log(JSON.parse(fs.readFileSync(__dirname + '/../package.json', 'utf8')).version);
    process.exit(0);
  }

  if (argv.help) {
    console.log('usage: botdylan [--dir <config directory>]');
    process.exit(0);
  }

  if (!env.configPath) {
    if (command === 'init') {
      fs.writeFileSync(path.join(process.cwd(), 'Botdylanfile.js'), fs.readFileSync(path.resolve(__dirname, '../Botdylanfile.js.sample'), 'utf8'), 'utf8');
      console.log("wrote Botdylanfile.js");
      process.exit(0);
    } else {
      console.error('No Botdylanfile found. Use `botdylan init` to generate one.');
      process.exit(1);
    }
  }

  process.chdir(env.configBase);

  var config = {};
  config = _.extend(config, require(env.configPath));
  if (argv.dir)
    config.dir = argv.dir;

  console.log('* Scripts path: ' + config.dir);
  console.log('* Configuration path: ' + env.configPath);
  
  require('../lib/bootstrap')(config);
});

