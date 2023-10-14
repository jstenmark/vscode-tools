#!/usr/bin/env -S node --experimental-modules

import fs from 'fs';
import readline from 'readline';
import { spawnSync } from 'child_process';
import yargs from 'yargs';

const argv = yargs(process.argv.slice(2))
  .version(false)
  .option('force', {
    alias: 'f',
    type: 'boolean',
    description: 'Force installation/update',
  })
  .option('log', {
    alias: 'l',
    type: 'boolean',
    description: 'Enable installation progress logging',
    default: true,
  })
  .option('table', {
    alias: 't',
    type: 'boolean',
    description: 'Display installation result tables',
    default: true,
  })
  .help('help')
  .alias('help', 'h')
  .demandCommand(1, 'Please provide the filepath argument.')
  .usage('Usage: $0 [filepath] [--force] [--log] [--table]')
  .argv;

const textFilePath = argv._[0]; // Input file path containing extension names

const installedExtensions = [];
const updatedExtensions = [];
const failedExtensions = [];

const rl = readline.createInterface({
  input: fs.createReadStream(textFilePath),
  output: process.stdout,
  terminal: false,
});

rl.on('line', (line) => {
  // Push each line (extension name) into the array
  const extensionName = line.trim();

  if (argv.log) {
    console.log(`   [Installing/Updating] ${extensionName}`);
  }

  const codeInstall = spawnSync('code', [
    argv.force ? '--force' : '',
    '--install-extension',
    extensionName,
  ], {
    stdio: argv.log ? 'inherit' : 'ignore',
    stderr: argv.log ? 'inherit' : 'ignore', // Redirect stderr to /dev/null if --log is omitted
  });

  if (codeInstall.error) {
    console.error(`   [Error] "${extensionName}": ${codeInstall.error.message}`);
    failedExtensions.push({ Status: 'Failed', Extension: extensionName });
  } else {
    if (codeInstall.stdout && codeInstall.stdout.toString().includes('is already installed')) {
      updatedExtensions.push({ Status: 'Updated', Extension: extensionName });
    } else {
      installedExtensions.push({ Status: 'Installed', Extension: extensionName });
    }
  }
});

rl.on('close', () => {
  if (installedExtensions.length > 0 && argv.table) {
    console.table(installedExtensions, ['Status', 'Extension']);
  }

  if (updatedExtensions.length > 0 && argv.table) {
    console.table(updatedExtensions, ['Status', 'Extension']);
  }

  if (failedExtensions.length > 0 && argv.table) {
    console.table(failedExtensions, ['Status', 'Extension']);
  }

  console.log(`Installed Extensions: ${installedExtensions.length}`);
  console.log(`Updated Extensions: ${updatedExtensions.length}`);
  console.log(`Failed Extensions: ${failedExtensions.length}`);
});
