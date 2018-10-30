module.exports = {
  XMLHttpRequest: require("xmlhttprequest"),
  btoa: require("btoa"),
  atob: require("atob"),
  alert: (msg) => { global._last_alert_message = msg; }
}
