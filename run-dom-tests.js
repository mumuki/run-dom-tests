#!/usr/bin/env node

const browserPolyfills = require("./browser-polyfills");
const Mocha = require("mocha");
const jsdom = require("node-jsdom");
const safeEval = require("safe-eval");
const tmp = require("tmp");
const fs = require("fs");
const _ = require("lodash");

const path = process.argv[2];
const ignoreErrors = process.argv[3] === "--ignore-errors";
const verboseReporter = process.argv[3] === "--verbose";
const request = JSON.parse(fs.readFileSync(path).toString());

function runScripts(node, context) {
  _.each(node.getElementsByTagName("script"), (child) => {
    const code = child.text || child.textContent || child.innerHTML || "";
    try { safeEval(code, context); } catch (e) { if (!ignoreErrors) throw e; }
  });
}

function runTests(testCode) {
  const tempFile = tmp.fileSync();
  fs.writeFileSync(tempFile.name, `
    const should  = require('${__dirname}/node_modules/chai').should();
    ${testCode}
  `);

  const mocha = new Mocha({ reporter: verboseReporter ? "spec" : "json" });
  mocha.addFile(tempFile.name);

  mocha.run((failures) => {
    process.exitCode = failures ? 1 : 0;
  });
}

jsdom.env(request.html, [], (errors, window) => {
  global.window = window;
  global.document = window.document;
  global.oldDocument = _.cloneDeep(document);
  const context = _.assign({}, browserPolyfills, { window, document });
  require("./browser-test-polyfills");

  runScripts(document, context);
  _dispatch_("DOMContentLoaded");
  runTests(request.tests);
});
