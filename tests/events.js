module.exports = {
  "html": `
<html>
  <head>
    <title>events</title>
  </head>
  <body>
    <button id="alert">Alert</button>
    <button id="confirm">Confirm</button>
    <button id="prompt">Prompt</button>
    <button id="prompt-and-alert">Prompt and Alert</button>
    <button id="confirm-and-alert">Confirm and Alert</button>
    <script>
      document.querySelector("#alert").addEventListener("click", () => alert("Hi!"));
      document.querySelector("#confirm").addEventListener("click", () => confirm("Are you sure?"));
      document.querySelector("#prompt").addEventListener("click", () => prompt("Please tell us your name"));
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
`,

  "tests": `
describe("events", function() {
  context("current API", () => {
    before(() => {
      _resetInteractions_();
    })

    it("shows an alert when the button is clicked", function() {
      _dispatch_("click", document.querySelector("#alert"));

      _shiftAlertMessage_().should.eql("Hi!");
    });

    it("shows a confirm when the button is clicked", function() {
      _dispatch_("click", document.querySelector("#confirm"));

      _shiftConfirmMessage_().should.eql("Are you sure?");
    });


    it("shows a prompt when the button is clicked", function() {
      _dispatch_("click", document.querySelector("#prompt"));

      _shiftPromptMessage_().should.eql("Please tell us your name");
    });
  })

  context("deprecated API", () => {
    it("shows an alert when the button is clicked", function() {
      _dispatch_("click", document.querySelector("#alert"));

      _last_alert_message_.should.eql("Hi!");
    });

    it("shows a confirm when the button is clicked", function() {
      _dispatch_("click", document.querySelector("#confirm"));

      _last_confirm_message_.should.eql("Are you sure?");
    });

    it("shows a prompt when the button is clicked", function() {
      _dispatch_("click", document.querySelector("#prompt"));

      _last_prompt_message_.should.eql("Please tell us your name");
    });

    it("allows stubbing prompt interaction", function() {
      _prompt_response_ = "Mumuki";

      _dispatch_("click", document.querySelector("#prompt-and-alert"));

      _last_prompt_message_.should.eql("Please tell us who you are");
      _last_alert_message_.should.eql("Hello Mumuki");

      _prompt_response_ = "Node";

      _dispatch_("click", document.querySelector("#prompt-and-alert"));

      _last_prompt_message_.should.eql("Please tell us who you are");
      _last_alert_message_.should.eql("Hello Node");
    });

    it("allows stubbing confirm interaction", function() {
      _confirm_response_ = false;

      _dispatch_("click", document.querySelector("#confirm-and-alert"));

      _last_confirm_message_.should.eql("Are you really sure?");
      _last_alert_message_.should.eql("Boo");

      _confirm_response_ = true;

      _dispatch_("click", document.querySelector("#confirm-and-alert"));

      _last_confirm_message_.should.eql("Are you really sure?");
      _last_alert_message_.should.eql("Yay");
    });
  })
});
`};
