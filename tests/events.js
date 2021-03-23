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
    <script>
      document.querySelector("#alert").addEventListener("click", () => alert("Hi!"));
      document.querySelector("#confirm").addEventListener("click", () => confirm("Are you sure?"));
      document.querySelector("#prompt").addEventListener("click", () => prompt("Please tell us your name"));
    </script>
  </body>
</html>
`,

  "tests": `
describe("events", function() {
  it("shows an alert when the button is clicked", function() {
    _dispatch_("click", document.querySelector("#alert"));

    _last_alert_message_.should.eql("Hi!");
  });

  it("shows a confirm when the button is clicked", function() {
    _dispatch_("click", document.querySelector("#confirm"));

    _last_confirm_message_.should.eql("Are you sure?");
  });

  it("shows a promt when the button is clicked", function() {
    _dispatch_("click", document.querySelector("#prompt"));

    _last_prompt_message_.should.eql("Please tell us your name");
  });
});
`};
