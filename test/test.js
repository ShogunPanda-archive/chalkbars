//
// This file is part of the chalkbars node module. Copyright (C) 2015 and above Shogun <shogun@cowtech.it>.
// Licensed under the MIT license, which can be found at http://www.opensource.org/licenses/mit-license.php.
//

(function(){
  "use strict";

  var expect = require("expect.js");
  var sinon = require("sinon");

  var verify_format = function(){
    var args = Array.prototype.slice.call(arguments, 0);
    var expected = args.pop();

    expect(chalkbars.format.apply(this, args)).to.equal(expected);
  };

  process.stdout.columns = 80;
  var chalk = require("chalk");
  var chalkbars = require("../main");

  describe("chalkbars.format", function(){
    describe("arguments handling", function(){
      it("should return a empty string when no arguments are give", function(){
        verify_format("");
        verify_format("", "");
      });

      it("should style using arguments and invoking chalk", function(){
        verify_format("{{#C \"red\"}}MESSAGE{{/C}}", chalk.red("MESSAGE"));
        verify_format("{{#C \"red\" \"yellow\"}}MESSAGE{{/C}}", chalk.red.yellow("MESSAGE"));
        verify_format("{{#C \"red yellow\"}}MESSAGE{{/C}}", chalk.red.yellow("MESSAGE"));
        verify_format("{{#C \"red\" yellow}}MESSAGE{{/C}}", chalk.red("MESSAGE"));
        verify_format("{{#C \"red\"}}MESSAGE{{#C \"yellow\"}}INNER{{/C}}RESTORE{{/C}}", chalk.red("MESSAGE" + chalk.yellow("INNER") + "RESTORE"));
      });

      it("should concatenate styles, using characters differen than letters, numbers, dashes, pounds and underscores as separator", function(){
        verify_format("{{#C bgGreen.underline}}MESSAGE{{/C}}", chalk.bgGreen.underline("MESSAGE"));
        verify_format("{{#C bgGreen$underline}}MESSAGE{{/C}}", chalk.bgGreen.underline("MESSAGE"));
        verify_format("{{#C bgGreen@underline}}MESSAGE{{/C}}", chalk.bgGreen.underline("MESSAGE"));
        verify_format("{{#C bgGreen/underline}}MESSAGE{{/C}}", chalk.bgGreen.underline("MESSAGE"));
        verify_format("{{#C bgGreen.underline@bold}}MESSAGE{{/C}}", chalk.bgGreen.underline.bold("MESSAGE"));
      });

      it("should concatenate arguments, using the last as context", function(){
        verify_format(
          "{{#C red}}{{field}}{{/C}}", null, "{{#C green}}{{otherField}}{{/C}}", {field: "FIELD", otherField: "OTHER"},
          chalk.red("FIELD") + "null" + chalk.green("OTHER")
        );
      });
    });

    describe("error handling", function(){
      it("should return the source string unparsed when silent mode is enabled", function(){
        chalkbars.configuration.silent = true;
        verify_format("{{#C custom}}MESSAGE", "{{#C custom}}MESSAGE");
      });

      it("should throw the exception when silent mode is disabled", function(){
        chalkbars.configuration.silent = false;
        expect(chalkbars.format).withArgs("{{#C custom}}MESSAGE").to.throwException();
        chalkbars.configuration.silent = true;
      });
    });

    describe("color handling", function(){
      it("should handle 8-bit color codes", function(){
        verify_format("{{#C i#196 I#046}}MESSAGE{{/C}}", "\x1b[48;5;046m\x1b[38;5;196mMESSAGE\x1b[39m\x1b[49m");
        verify_format("{{#C x#500 X#050}}MESSAGE{{/C}}", "\x1b[48;5;46m\x1b[38;5;196mMESSAGE\x1b[39m\x1b[49m");
      });

      it("should handle 24-bit color codes", function(){
        verify_format("{{#C h#FF0000 H#00FF00}}MESSAGE{{/C}}", "\x1b[48;2;0;255;0m\x1b[38;2;255;0;0mMESSAGE\x1b[39m\x1b[49m");

      });
    });
  });

  describe("chalkbars.style", function(){
    it("should allow to fetch existing style", function(){
      expect(chalkbars.style()).to.equal(undefined);
      expect(chalkbars.style("")).to.equal(undefined);
      expect(chalkbars.style("bracket")).to.equal("bold blue");
    });

    it("should allow to fetch existing style", function(){
      chalkbars.style("new-style-1", "red")
      expect(chalkbars.style("new-style-1")).to.equal("red");
      chalkbars.style("new-style-1", "green")
      expect(chalkbars.style("new-style-1")).to.equal("green");
    });

    it("should allow to remove a style", function(){
      chalkbars.style("new-style-1", "red");
      chalkbars.style("new-style-2", "green");
      chalkbars.style("new-style-3", "blue");

      expect(chalkbars.style("new-style-1", null)).to.equal("red");
      expect(chalkbars.style("new-style-2", "")).to.equal("green");
      expect(chalkbars.style("new-style-3", false)).to.equal("blue");

      expect(chalkbars.style("new-style-1")).to.equal(undefined);
      expect(chalkbars.style("new-style-2")).to.equal(undefined);
      expect(chalkbars.style("new-style-3")).to.equal(undefined);
    });

    it("should NOT allow to shadow a chalk style", function(){
      expect(chalkbars.style).withArgs("red", "yellow").to.throwException(/Cannot use "red" as a custom style name as it would shadow a chalk style/);
    });

    it("should NOT allow to INNERine nested styles", function(){
      expect(chalkbars.style).withArgs("new-style-2", "bracket").to.throwException(/Nesting of custom styles is not supported/);
    });

    it("should NOT allow values different from string", function(){
      expect(chalkbars.style).withArgs("new-style-2", {a: 1}).to.throwException(/Only strings are supported a values for styles/);
    });

    it("should resolve styles in templates", function(){
      verify_format("{{#C \"bracket-2\"}}MESSAGE{{/C}}", "MESSAGE");
      verify_format("{{#C \"bracket\"}}MESSAGE{{/C}}", chalk.bold.blue("MESSAGE"));
    });

    it("should have a list of default styles", function(){
      verify_format("{{#C \"highlight\"}}MESSAGE{{/C}}", chalk.cyan("MESSAGE"));
      verify_format("{{#C \"bracket\"}}MESSAGE{{/C}}", chalk.bold.blue("MESSAGE"));
      verify_format("{{#C \"info\"}}MESSAGE{{/C}}", chalk.bold.white("MESSAGE"));
      verify_format("{{#C \"skip\"}}MESSAGE{{/C}}", chalk.bold.gray("MESSAGE"));
      verify_format("{{#C \"ok\"}}MESSAGE{{/C}}", chalk.bold.green("MESSAGE"));
      verify_format("{{#C \"success\"}}MESSAGE{{/C}}", chalk.bold.green("MESSAGE"));
      verify_format("{{#C \"warn\"}}MESSAGE{{/C}}", chalk.bold.yellow("MESSAGE"));
      verify_format("{{#C \"fatal\"}}MESSAGE{{/C}}", chalk.bold.red("MESSAGE"));
      verify_format("{{#C \"fail\"}}MESSAGE{{/C}}", chalk.bold.red("MESSAGE"));
      verify_format("{{#C \"error\"}}MESSAGE{{/C}}", chalk.bold.red("MESSAGE"));
      verify_format("{{#C \"pass\"}}MESSAGE{{/C}}", chalk.bold.magenta("MESSAGE"));
      verify_format("{{#C \"debug\"}}MESSAGE{{/C}}", "\x1b[1m\x1b[38;5;45mMESSAGE\x1b[39m\x1b[22m");
    });
  });

  describe("chalkbars.formatNoColor", function(){
    it("should apply format and remove colors", function(){
      expect(chalkbars.formatNoColor("{{#C red}}{{field}}{{/C}}", {field: "FIELD"})).to.equal("FIELD");
      expect(chalkbars.formatNoColor("{{B warn}} Message {{E skip}}")).to.equal("[ WARN] Message \n\x1b[1A\x1b[74C[SKIP]");
    });
  });

  describe("chalkbars.plainFormat", function(){
    it("should apply format and remove all ANSI escapes", function(){
      expect(chalkbars.plainFormat("{{#C red}}{{field}}{{/C}}", {field: "FIELD"})).to.equal("FIELD");
      expect(chalkbars.plainFormat("{{B warn}} Message {{E skip}}")).to.equal("[ WARN] Message \n[SKIP]");
    });
  });

  describe("chalkbars.log", function(){
    it("should apply chalkbars and then log it to the console", function(){
      var stub = sinon.stub(console, "log");

      chalkbars.log("{{#C red}}{{field}}{{/C}}", {field: "FIELD"});
      chalkbars.log("{{B warn}} Message {{E skip}}");

      expect(stub.withArgs(chalk.red("FIELD")).calledOnce).to.be(true);
      expect(stub.withArgs(chalkbars.format("{{B warn}} Message {{E skip}}")).calledOnce).to.be(true);

      stub.restore();
    });
  });

  describe("chalkbars handlebars helpers", function(){
    describe("B", function(){
      it("should display a banner", function(){
        verify_format("{{B}}", "");
        verify_format("{{B info}}", chalk.bold.blue("[") + chalk.bold.white(" INFO") + chalk.bold.blue("]"));
        verify_format("{{B info red}}", chalk.bold.blue("[") + chalk.bold.white.red("INFO RED") + chalk.bold.blue("]"));
        verify_format("{{B \"info\" \"red\"}}", chalk.bold.blue("[") + chalk.red(" INFO") + chalk.bold.blue("]"));
      });

      describe("should support common shortcuts", function(){
        var shortcuts = {"BI": "info", "BW": "warn", "BO": "success", "BF": "fail", "BE": "error", "BP": "pass", "BS": "skip", "BD": "debug"};

        Object.keys(shortcuts).forEach(function(shortcut){
          it(shortcut, function(){
            verify_format("{{" + shortcut + "}}", chalkbars.format("{{B " + shortcuts[shortcut] + "}}"));
          });
        });
      });
    });

    describe("E", function(){
      it("should display a footer", function(){
        verify_format("{{E}}", "");
        verify_format("{{E ok}}", "\n\x1b[1A\x1b[74C" + chalk.bold.blue("[") + chalk.bold.green(" OK ") + chalk.bold.blue("]"));
        verify_format("{{E o}}", "\n\x1b[1A\x1b[74C" + chalk.bold.blue("[") + chalk.bold.green(" O  ") + chalk.bold.blue("]"));
        verify_format("{{E ooo}}", "\n\x1b[1A\x1b[74C" + chalk.bold.blue("[") + chalk.bold.green(" OOO") + chalk.bold.blue("]"));
        verify_format("{{E ok red}}", "\n\x1b[1A\x1b[72C" + chalk.bold.blue("[") + chalk.bold.green.red("OK RED") + chalk.bold.blue("]"));
        verify_format("{{E \"ok\" \"red\"}}", "\n\x1b[1A\x1b[74C" + chalk.bold.blue("[") + chalk.red(" OK ") + chalk.bold.blue("]"));
        verify_format(
          "This is another message {{E ok}}",
          "This is another message \n\x1b[1A\x1b[74C" + chalk.bold.blue("[") + chalk.bold.green(" OK ") + chalk.bold.blue("]")
        );
        verify_format(
          "This is another message {{E \"warn\" \"green\"}}",
          "This is another message \n\x1b[1A\x1b[74C" + chalk.bold.blue("[") + chalk.green("WARN") + chalk.bold.blue("]")
        );
      });

      describe("should support common shortcuts", function(){
        var shortcuts = {"EI": "info", "EW": "warn", "EO": "ok", "EF": "fail", "EE": "error", "EP": "pass", "ES": "skip", "ED": "debug"};

        Object.keys(shortcuts).forEach(function(shortcut){
          it(shortcut, function(){
            verify_format("{{" + shortcut + "}}", chalkbars.format("{{E " + shortcuts[shortcut] + "}}"));
          });
        });
      });
    });

    it("B and E should use set brackets", function(){
      var oldOpening = chalkbars.configuration.openingBracket;
      var oldClosing = chalkbars.configuration.closingBracket;

      chalkbars.configuration.openingBracket = "(";
      chalkbars.configuration.closingBracket = ")";

      verify_format(
        "{{B warn}} Message {{E skip}}",
        "(" + chalk.bold.yellow(" WARN") + ") Message \n\x1b[1A\x1b[74C(" + chalk.bold.gray("SKIP") + ")"
      );

      chalkbars.configuration.openingBracket = oldOpening;
      chalkbars.configuration.closingBracket = oldClosing;
    });
  });
})();
