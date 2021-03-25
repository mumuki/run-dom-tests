module.exports = {
  "html": `
<html>
  <head>
    <title>old title</title>
    <script>
      var foo = 2;
      document.title = atob("VGl0bGUgY2hhbmdlZCEgI0hBQ0tFUk1BTg==");
    </script>


    <p id="first">
    This is a paragraph
    </p>

    <button id="insert-section">Insert a new section</button>

    <p id="second">
    This is another paragraph
    </p>

    <script>
      function insertSection() {
        const secondDiv = document.getElementById("second");
        const section = document.createElement("section");
        document.body.insertBefore(section, secondDiv);
      }
      document.getElementById("insert-section").addEventListener("click", insertSection);
      insertSection();
    </script>

  </head>
  <body>
  </body>
</html>
`,

  "tests": `
describe("dom things", function() {

  context('deprecated API', () => {
    it("changes the page title", function() {
      oldDocument.title.should.be.eql("old title");
      document.title.should.be.eql("Title changed! #HACKERMAN");
    });
  })

  context('current API', () => {
    it("handles static dom", () => {
      _originalDocument_.getElementsByTagName("p").length.should.eql(2);
      document.getElementsByTagName("p").length.should.eql(2);
    })

    describe("script tags", () => {
      it("changes the page title", function() {
        _originalDocument_.title.should.be.eql("old title");
        document.title.should.be.eql("Title changed! #HACKERMAN");
      });

      it("inserts dom elements", () => {
        _originalDocument_.getElementsByTagName("section").length.should.eql(0);
        document.getElementsByTagName("section").length.should.eql(1);
      });
    })

    describe("event handlers", () => {
      beforeEach(() => {
        _resetDocument_();
      });

      it("inserts dom elements after a single event", () => {
        const button = document.getElementById("insert-section");

        _dispatch_("click", button);

        _originalDocument_.getElementsByTagName("section").length.should.eql(0);
        document.getElementsByTagName("section").length.should.eql(2);
      });

      it("inserts dom elements after multiple events", () => {
        const button = document.getElementById("insert-section");

        _dispatch_("click", button);
        _dispatch_("click", button);
        _dispatch_("click", button);

        _originalDocument_.getElementsByTagName("section").length.should.eql(0);
        document.getElementsByTagName("section").length.should.eql(4);
      });
    })
  })
});
`};
