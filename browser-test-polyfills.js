const WAIT_FOR_TIMEOUT = 50;

global._last_alert_message_ = null;
global._last_confirm_message_ = null;
global._last_prompt_message_ = null;
global._confirm_response_ = null;
global._prompt_response_ = null;

global._dispatch_ = (type, node = document) => {
  const event = document.createEvent("Event");
  event.initEvent(type, true, true);
  node.dispatchEvent(event);
};

global._wait_for_ = (condition, then) => {
  setTimeout(() => {
    if (!condition()) _wait_for(condition, then)
    else then();
  }, WAIT_FOR_TIMEOUT);
}

global._nock_ = require("nock");
