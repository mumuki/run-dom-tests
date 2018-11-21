module.exports = {
  XMLHttpRequest: require("xmlhttprequest"),
  fetch: require("node-fetch"),
  btoa: require("btoa"),
  atob: require("atob"),
  alert: (msg) => { global._last_alert_message_ = msg; },
  confirm: (msg) => {
    global._last_confirm_message_ = msg;
    return global._confirm_response_;
  },
  prompt: (msg) => {
    global._last_prompt_message_ = msg;
    return global._prompt_response_;
  }
}
