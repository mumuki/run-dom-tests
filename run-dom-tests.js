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
    try { safeEval(wrapCode(code), context); } catch (e) { if (!ignoreErrors) throw e; }
  });
}

function wrapCode(code) {
  return `(function() {${code}})()`;
}

function runTests(testCode) {
  const tempFile = tmp.fileSync();
  fs.writeFileSync(tempFile.name, `
    const chai = require('${__dirname}/node_modules/chai');
    chai.use(require('${__dirname}/node_modules/chai-dom'));
    const should = chai.should();
    ${testCode}
  `);

  const mocha = new Mocha({ reporter: verboseReporter ? "spec" : "json" });
  mocha.addFile(tempFile.name);

  mocha.run((failures) => {
    process.exitCode = failures ? 1 : 0;
  });
}

/**
 * Use `_originalDocument_` instead
 *
 * @deprecated
 **/
global.oldDocument = null;

/**
 * The original HTML document, before any JavaScript actions
 * are executed
 *
 * @type HTMLDocument
 */
global._originalDocument_ = null;

/**
 * Resets the `document` to its original state,
 * discarding every document polyfill
 * and then runs its scripts again.
 *
 * `window` is not cleared.
 */
global._resetDocument_ = () => {
  global.document = _.cloneDeep(global._originalDocument_);
  const context = _.assign({}, browserPolyfills, { window: global.window, document: global.document  });
  require("./browser-test-polyfills");

  runScripts(document, context);
  _dispatch_("DOMContentLoaded");
};

/**
 * Resets the document, interactions and nock state
 */
global._resetAll_ = () => {
  global._resetDocument_();
  global._resetUserInteractions_();
  global._resetHttpInteractions_();
};

jsdom.env(request.html, [], (errors, window) => {
  global.window = window;
  global.oldDocument = window.document;
  global._originalDocument_ = global.oldDocument;
  global._resetAll_();
  runTests(request.tests);
});
