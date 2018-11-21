module.exports = {
  "html": `
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
`,

  "tests": `
describe("ajax", function() {
  it("shows the downloaded content when the button is clicked", function(done) {
    document.querySelector("#data").innerHTML.should.eql("Nothing yet...");

    _nock_.cleanAll();
    const mockedGet = _nock_("https://some-domain.com/")
      .get("/some-data.json")
      .reply(200, { content: "Some remote data" });

    _dispatch_('click', document.querySelector("#get-data"));

    _wait_for_(() => mockedGet.isDone(), () => {
      document.querySelector("#data").innerHTML.should.eql("Some remote data");
      done();
    });
  });
});
`};
