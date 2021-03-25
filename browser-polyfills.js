module.exports = {
  XMLHttpRequest: require("xmlhttprequest"),
  fetch: require("node-fetch"),
  btoa: require("btoa"),
  atob: require("atob"),
  alert: (msg) => {
    global._push_alert_message_(msg);
  },
  confirm: (msg) => {
    global._push_confirm_message_(msg);
    return global._shift_confirm_response_();
  },
  prompt: (msg) => {
    global._push_prompt_message_(msg);
    return global._shift_prompt_response_();
  }
}
