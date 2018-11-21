module.exports = {
  "html": `
<html>
  <head>
    <title>events</title>
  </head>
  <body>
    <button>Say hello</button>
    <script>
      document.querySelector("button").addEventListener("click", () => alert("Hi!"));
    </script>
  </body>
</html>
`,

  "tests": `
describe("events", function() {
  it("shows an alert when the button is clicked", function() {
    _dispatch_("click", document.querySelector("button"));

    _last_alert_message_.should.eql("Hi!");
  });
});
`};
