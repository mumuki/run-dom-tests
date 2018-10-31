module.exports = {
  XMLHttpRequest: require("xmlhttprequest"),
  btoa: require("btoa"),
  atob: require("atob"),
  alert: (msg) => { global._last_alert_message_ = msg; },
  confirm: () => global._confirm_response_,
  prompt: () => global._prompt_response_
}
