#!/usr/bin/env node

const childProcess = require("child_process");
const tmp = require("tmp");
const fs = require("fs");

const path = process.argv[2];
const test = require(`./${path}`);

const tempFile = tmp.fileSync();
fs.writeFileSync(tempFile.name, JSON.stringify(test));

try {
  const output = childProcess.execSync(`./run-dom-tests.js ${tempFile.name} --verbose`);
  console.log(output.toString());
} catch (e) {
  console.log(e.stdout.toString());
  process.exit(1);
}
