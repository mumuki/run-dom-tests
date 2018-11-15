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
