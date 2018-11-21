module.exports = {
  "html": `
<html>
  <head>
    <title>old title</title>
    <script>
      document.title = atob("VGl0bGUgY2hhbmdlZCEgI0hBQ0tFUk1BTg==");
    </script>
  </head>
  <body>
  </body>
</html>
`,

  "tests": `
describe("dom things", function() {
  it("changes the page title", function() {
    oldDocument.title.should.be.eql("old title");
    document.title.should.be.eql("Title changed! #HACKERMAN");
  });
});
`};
