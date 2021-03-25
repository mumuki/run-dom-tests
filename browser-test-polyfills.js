/**
 * Polling period of `_waitFor_`
 *
 * @type {number}
 */
const WAIT_FOR_TIMEOUT = 50;

/**
 * Private API
 **/

['alert', 'confirm', 'prompt'].forEach(it => {
  const last = `_last_${it}_message_`;
  const list = `_${it}_messages_`;

  global[last] = null;
  global[`_push_${it}_message_`] = (message) => {
    global[last] = message;
    global[list].push(message);
  };
});

['confirm', 'prompt'].forEach(it => {
  const list = `_${it}_responses_`;
  const single = `_${it}_response_`;

  global[single] = null;
  global[`_shift_${it}_response_`] = () => global[single] || global[list].shift();
});

/**
 * @deprecated use `_waitFor_` instead
 */
global._wait_for_ = (condition, then) => {
  setTimeout(() => {
    if (!condition()) _wait_for_(condition, then)
    else then();
  }, WAIT_FOR_TIMEOUT);
}

/**
 * Public API
 **/

/**
 * nock object for mocking http interactions
 * @see https://github.com/nock/nock
 */
global._nock_ = require("nock");

/**
 * Waits for a condition to occur, and then executes an action.
 * This function will check for the condition with a period of `WAIT_FOR_TIMEOUT`.
 *
 * @param {() => boolean} condition the condition to wait
 * @param {() => ()} action the action to execute
 *
 * @see WAIT_FOR_TIMEOUT
 */
global._waitFor_ = global._wait_for_;

/**
 * Simulates the dispatch of an event of the given type
 * to the given node
 *
 * @param {string} type the event type, such as `click` or `DOMContentLoaded`
 * @param {HTMLElement} node the simulated event target. `document` by default
 */
global._dispatch_ = (type, node = document) => {
  const event = document.createEvent("Event");
  event.initEvent(type, true, true);
  node.dispatchEvent(event);
};

/**
 * Enqueues an stubbed confirm window response message.
 *
 * This function must be called in order, before the first alert `confirm` is performed
 *
 * @param {string} response the stubbed response of the confirm window
 */
global._stubConfirmResponse_ = (response) => global._confirm_responses_.push(response);

/**
 * Enqueues an stubbed a prompt window response message
 *
 * This function must be called in order, before the first alert `prompt` is performed
 *
 * @param {string} response the stubbed response of the prompt window
 */
global._stubPromptResponse_ = (response) => global._prompt_responses_.push(response);

/**
 * Dequeues the first pending alert message to check.
 *
 * Subsequent calls to this function will produce different results. When there are no more
 * alert messages to dequeue, undefined is returned
 *
 * @returns {string} the first pending alert message
 */
global._shiftAlertMessage_ = () => global._alert_messages_.shift();

/**
 * Dequeues the first pending confirm message to check.
 *
 * Subsequent calls to this function will produce different results. When there are no more
 * confirm messages to dequeue, undefined is returned
 *
 * @returns {boolean} the first pending confirm message
 */
global._shiftConfirmMessage_ = () => global._confirm_messages_.shift();

/**
 * Dequeues the first pending prompt message to check.
 *
 * Subsequent calls to this function will produce different results. When there are no more
 * prompt messages to dequeue, undefined is returned
 *
 * @returns {string} the first pending prompt message
 */
global._shiftPromptMessage_ = () => global._prompt_messages_.shift();

/**
 * Answers the number of the pending alert message to check
 *
 * @returns {number} the pending messages count to check
 */
global._alertMessagesCount_ = () => global._alert_messages_.length;

/**
 * Answers the number of the pending confirm message to check
 *
 * @returns {number} the pending messages count to check
 */
global._confirmMessagesCount_ = () => global._confirm_messages_.length;


/**
 * Answers the number of the pending prompt message to check
 *
 * @returns {number} the pending messages count to check
 */
global._promptMessagesCount_ = () => global._prompt_messages_.length;

/**
 * Reset all stubs and messages
 */
global._resetUserInteractions_ = () => {
  global._alert_messages_ = [];
  global._confirm_messages_ = [];
  global._prompt_messages_ = [];
  global._confirm_responses_ = [];
  global._prompt_responses_ = [];
};

/**
 * Reset nock state
 */
global._resetHttpInteractions_ = () => {
  global._nock_.cleanAll();
}