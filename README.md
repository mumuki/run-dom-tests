run-dom-tests
=============

Run [mocha](https://mochajs.org/) + [chai](https://www.chaijs.com/plugins/chai-dom/) tests on node.js using a virtual DOM.

# Install

```
npm install -g run-dom-tests
run-dom-tests test.json
```

**JSON file format**: `{ html, tests }`

# Test

```
npm test
```

# Usage sample

## User interactions

User interactions like `alert` and `prompt` can be tested by stubbing user responses using `_stubXxxResponse_` and checking prompted messages with `_shiftXxxMessage_`.

For example given the following HTML document...

```html
<html>
  <head>
    <title>events</title>
  </head>
  <body>
    <button id="prompt-and-alert">Prompt and Alert</button>
    <button id="confirm-and-alert">Confirm and Alert</button>
    <script>
      document.querySelector("#prompt-and-alert").addEventListener("click", () => {
        let name = prompt("Please tell us who you are");
        alert("Hello " + name);
      });
      document.querySelector("#confirm-and-alert").addEventListener("click", () => {
        let result = confirm("Are you really sure?");
        if (result) {
          alert("Yay");
        } else {
          alert("Boo");
        }
      });
    </script>
  </body>
</html>
```

...you can write the following user interaction tests:


```javascript
describe("User interactions", () => {
  beforeEach(() => {
    // call before each test in
    // order to clear user interactions registered and tested
    // through _stubXxxResponse_ and _shiftXxxMessage_
    _resetUserInteractions_();

    // if you also need to reset the document state
    // you can call `_resetDocument_()`
  })

  it("allows stubbing sequential confirm interaction", function() {
    // stub responses before calling the code
    _stubConfirmResponse_(false);
    _stubConfirmResponse_(true);

    // fire the actual code
    // by simulating events
    _dispatch_("click", document.querySelector("#confirm-and-alert"));
    _dispatch_("click", document.querySelector("#confirm-and-alert"));

    // run assertions
    _alertMessagesCount_().should.eql(2);
    _confirmMessagesCount_().should.eql(2);

    "Are you really sure?".should.eql(_shiftConfirmMessage_());
    "Boo".should.eql(_shiftAlertMessage_());
    "Are you really sure?".should.eql(_shiftConfirmMessage_());
    "Yay".should.eql(_shiftAlertMessage_());

    _alertMessagesCount_().should.eql(0);
    _confirmMessagesCount_().should.eql(0);
  });

  it("allows stubbing sequential prompt interaction", function() {
    // stub responses before calling the code
    _stubPromptResponse_("Node");
    _stubPromptResponse_("Mumuki");
    _stubPromptResponse_("JS");

    // fire the actual code
    // by simulating events
    _dispatch_("click", document.querySelector("#prompt-and-alert"));
    _dispatch_("click", document.querySelector("#prompt-and-alert"));
    _dispatch_("click", document.querySelector("#prompt-and-alert"));

    // run assertions
    _alertMessagesCount_().should.eql(3);
    _promptMessagesCount_().should.eql(3);

    "Hello Node".should.eql(_shiftAlertMessage_());
    "Hello Mumuki".should.eql(_shiftAlertMessage_());
    "Hello JS".should.eql(_shiftAlertMessage_());

    _alertMessagesCount_().should.eql(0);
    _promptMessagesCount_().should.eql(3);
  });
});
```

## HTTP Interactions

HTTP Interaction tests are are built on top of [nock](https://github.com/nock/nock), using the `_nock_` object.

Given the following HTML document...

```html
<html>
  <head>
    <title>ajax</title>
    <script>
      document.addEventListener("DOMContentLoaded", () => {
        document.querySelector("#get-data").addEventListener("click", () => {
          fetch("https://some-domain.com/some-data.json")
            .then((response) => {
              return response.json();
            })
            .then((data) => {
              document.querySelector("#data").innerHTML = data.content;
            });
        });
      });
    </script>
  </head>
  <body>
    <div>
      <button id="get-data">GET DATA NOW!</button>
    </div>

    <h1>Remote data:</h1>
    <pre id="data">Nothing yet...</pre>
  </body>
</html>
```

...you can write the following HTTP interaction tests:


```javascript
describe("HTTP Interactions", function() {
  beforeEach(() => {
    // resets all user interactions,
    // dom state and http interactions
    _resetAll_();

    // if only http interactions need to be reseted,
    // call _resetHttpInteractions_() instead
  });

  it("shows the downloaded content when the button is clicked", function(done) {
    document.querySelector("#data").innerHTML.should.eql("Nothing yet...");

    const mockedGet = _nock_("https://some-domain.com/")
      .get("/some-data.json")
      .reply(200, { content: "Some remote data" });

    _dispatch_('click', document.querySelector("#get-data"));

    _waitFor_(() => mockedGet.isDone(), () => {
      document.querySelector("#data").innerHTML.should.eql("Some remote data");
      done();
    });
  });
});
```

# Reference

## Members

<dl>
<dt><del><a href="#oldDocument">oldDocument</a></del></dt>
<dd></dd>
<dt><a href="#_originalDocument_">_originalDocument_</a> : <code>HTMLDocument</code></dt>
<dd><p>The original HTML document, before any JavaScript actions
are executed</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#WAIT_FOR_TIMEOUT">WAIT_FOR_TIMEOUT</a> : <code>number</code></dt>
<dd><p>Polling period of <code>_waitFor_</code></p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#_resetDocument_">_resetDocument_()</a></dt>
<dd><p>Resets the <code>document</code> to its original state,
discarding every document polyfill
and then runs its scripts again.</p>
<p><code>window</code> is not cleared.</p>
</dd>
<dt><a href="#_resetAll_">_resetAll_()</a></dt>
<dd><p>Resets the document, interactions and nock state</p>
</dd>
</dl>

<a name="oldDocument"></a>

## ~~oldDocument~~
***Deprecated***

**Kind**: global variable
<a name="_originalDocument_"></a>

## \_originalDocument\_ : <code>HTMLDocument</code>
The original HTML document, before any JavaScript actions
are executed

**Kind**: global variable
<a name="WAIT_FOR_TIMEOUT"></a>

## WAIT\_FOR\_TIMEOUT : <code>number</code>
Polling period of `_waitFor_`

**Kind**: global constant
<a name="_resetDocument_"></a>

## \_resetDocument\_()
Resets the `document` to its original state,
discarding every document polyfill
and then runs its scripts again.

`window` is not cleared.

**Kind**: global function
<a name="_resetAll_"></a>

## \_resetAll\_()
Resets the document, interactions and nock state

**Kind**: global function
franco@balaan:~/Documents/mumuki/run-dom-tests$ jsdoc2md browser-test-polyfills.js run-dom-tests.js
## Members

<dl>
<dt><a href="#_nock_">_nock_</a></dt>
<dd><p>nock object for mocking http interactions</p>
</dd>
<dt><a href="#_waitFor_">_waitFor_</a></dt>
<dd><p>Waits for a condition to occur, and then executes an action.
This function will check for the condition with a period of <code>WAIT_FOR_TIMEOUT</code>.</p>
</dd>
<dt><del><a href="#oldDocument">oldDocument</a></del></dt>
<dd></dd>
<dt><a href="#_originalDocument_">_originalDocument_</a> : <code>HTMLDocument</code></dt>
<dd><p>The original HTML document, before any JavaScript actions
are executed</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#WAIT_FOR_TIMEOUT">WAIT_FOR_TIMEOUT</a> : <code>number</code></dt>
<dd><p>Polling period of <code>_waitFor_</code></p>
</dd>
</dl>

## Functions

<dl>
<dt><del><a href="#_wait_for_">_wait_for_()</a></del></dt>
<dd></dd>
<dt><a href="#_dispatch_">_dispatch_(type, node)</a></dt>
<dd><p>Simulates the dispatch of an event of the given type
to the given node</p>
</dd>
<dt><a href="#_stubConfirmResponse_">_stubConfirmResponse_(response)</a></dt>
<dd><p>Enqueues an stubbed confirm window response message.</p>
<p>This function must be called in order, before the first alert <code>confirm</code> is performed</p>
</dd>
<dt><a href="#_stubPromptResponse_">_stubPromptResponse_(response)</a></dt>
<dd><p>Enqueues an stubbed a prompt window response message</p>
<p>This function must be called in order, before the first alert <code>prompt</code> is performed</p>
</dd>
<dt><a href="#_shiftAlertMessage_">_shiftAlertMessage_()</a> ⇒ <code>string</code></dt>
<dd><p>Dequeues the first pending alert message to check.</p>
<p>Subsequent calls to this function will produce different results. When there are no more
alert messages to dequeue, undefined is returned</p>
</dd>
<dt><a href="#_shiftConfirmMessage_">_shiftConfirmMessage_()</a> ⇒ <code>boolean</code></dt>
<dd><p>Dequeues the first pending confirm message to check.</p>
<p>Subsequent calls to this function will produce different results. When there are no more
confirm messages to dequeue, undefined is returned</p>
</dd>
<dt><a href="#_shiftPromptMessage_">_shiftPromptMessage_()</a> ⇒ <code>string</code></dt>
<dd><p>Dequeues the first pending prompt message to check.</p>
<p>Subsequent calls to this function will produce different results. When there are no more
prompt messages to dequeue, undefined is returned</p>
</dd>
<dt><a href="#_alertMessagesCount_">_alertMessagesCount_()</a> ⇒ <code>number</code></dt>
<dd><p>Answers the number of the pending alert message to check</p>
</dd>
<dt><a href="#_confirmMessagesCount_">_confirmMessagesCount_()</a> ⇒ <code>number</code></dt>
<dd><p>Answers the number of the pending confirm message to check</p>
</dd>
<dt><a href="#_promptMessagesCount_">_promptMessagesCount_()</a> ⇒ <code>number</code></dt>
<dd><p>Answers the number of the pending prompt message to check</p>
</dd>
<dt><a href="#_resetUserInteractions_">_resetUserInteractions_()</a></dt>
<dd><p>Reset all stubs and messages</p>
</dd>
<dt><a href="#_resetHttpInteractions_">_resetHttpInteractions_()</a></dt>
<dd><p>Reset nock state</p>
</dd>
<dt><a href="#_resetDocument_">_resetDocument_()</a></dt>
<dd><p>Resets the <code>document</code> to its original state,
discarding every document polyfill
and then runs its scripts again.</p>
<p><code>window</code> is not cleared.</p>
</dd>
<dt><a href="#_resetAll_">_resetAll_()</a></dt>
<dd><p>Resets the document, interactions and nock state</p>
</dd>
</dl>

<a name="_nock_"></a>

## \_nock\_
nock object for mocking http interactions

**Kind**: global variable
**See**: https://github.com/nock/nock
<a name="_waitFor_"></a>

## \_waitFor\_
Waits for a condition to occur, and then executes an action.
This function will check for the condition with a period of `WAIT_FOR_TIMEOUT`.

**Kind**: global variable
**See**: WAIT_FOR_TIMEOUT

| Param | Type | Description |
| --- | --- | --- |
| condition | <code>\*</code> | the condition to wait |
| action | <code>\*</code> | the action to execute |

<a name="oldDocument"></a>

## ~~oldDocument~~
***Deprecated***

**Kind**: global variable
<a name="_originalDocument_"></a>

## \_originalDocument\_ : <code>HTMLDocument</code>
The original HTML document, before any JavaScript actions
are executed

**Kind**: global variable
<a name="WAIT_FOR_TIMEOUT"></a>

## WAIT\_FOR\_TIMEOUT : <code>number</code>
Polling period of `_waitFor_`

**Kind**: global constant
<a name="_wait_for_"></a>

## ~~\_wait\_for\_()~~
***Deprecated***

**Kind**: global function
<a name="_dispatch_"></a>

## \_dispatch\_(type, node)
Simulates the dispatch of an event of the given type
to the given node

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| type | <code>string</code> | the event type, such as `click` or `DOMContentLoaded` |
| node | <code>HTMLElement</code> | the simulated event target. `document` by default |

<a name="_stubConfirmResponse_"></a>

## \_stubConfirmResponse\_(response)
Enqueues an stubbed confirm window response message.

This function must be called in order, before the first alert `confirm` is performed

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| response | <code>string</code> | the stubbed response of the confirm window |

<a name="_stubPromptResponse_"></a>

## \_stubPromptResponse\_(response)
Enqueues an stubbed a prompt window response message

This function must be called in order, before the first alert `prompt` is performed

**Kind**: global function

| Param | Type | Description |
| --- | --- | --- |
| response | <code>string</code> | the stubbed response of the prompt window |

<a name="_shiftAlertMessage_"></a>

## \_shiftAlertMessage\_() ⇒ <code>string</code>
Dequeues the first pending alert message to check.

Subsequent calls to this function will produce different results. When there are no more
alert messages to dequeue, undefined is returned

**Kind**: global function
**Returns**: <code>string</code> - the first pending alert message
<a name="_shiftConfirmMessage_"></a>

## \_shiftConfirmMessage\_() ⇒ <code>boolean</code>
Dequeues the first pending confirm message to check.

Subsequent calls to this function will produce different results. When there are no more
confirm messages to dequeue, undefined is returned

**Kind**: global function
**Returns**: <code>boolean</code> - the first pending confirm message
<a name="_shiftPromptMessage_"></a>

## \_shiftPromptMessage\_() ⇒ <code>string</code>
Dequeues the first pending prompt message to check.

Subsequent calls to this function will produce different results. When there are no more
prompt messages to dequeue, undefined is returned

**Kind**: global function
**Returns**: <code>string</code> - the first pending prompt message
<a name="_alertMessagesCount_"></a>

## \_alertMessagesCount\_() ⇒ <code>number</code>
Answers the number of the pending alert message to check

**Kind**: global function
**Returns**: <code>number</code> - the pending messages count to check
<a name="_confirmMessagesCount_"></a>

## \_confirmMessagesCount\_() ⇒ <code>number</code>
Answers the number of the pending confirm message to check

**Kind**: global function
**Returns**: <code>number</code> - the pending messages count to check
<a name="_promptMessagesCount_"></a>

## \_promptMessagesCount\_() ⇒ <code>number</code>
Answers the number of the pending prompt message to check

**Kind**: global function
**Returns**: <code>number</code> - the pending messages count to check
<a name="_resetUserInteractions_"></a>

## \_resetInteractions\_()
Reset all stubs and messages

**Kind**: global function
<a name="_resetHttpInteractions_"></a>

## \_resetNock\_()
Reset nock state

**Kind**: global function
<a name="_resetDocument_"></a>

## \_resetDocument\_()
Resets the `document` to its original state,
discarding every document polyfill
and then runs its scripts again.

`window` is not cleared.

**Kind**: global function
<a name="_resetAll_"></a>

## \_resetAll\_()
Resets the document, interactions and nock state

**Kind**: global function