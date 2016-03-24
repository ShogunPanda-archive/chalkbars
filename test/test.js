/*
 * This file is part of the chalkbars npm package. Copyright (C) 2015 and above Shogun <shogun@cowtech.it>.
 * Licensed under the MIT license, which can be found at http://www.opensource.org/licenses/mit-license.php.
 */

/* globals describe, it */
/* eslint-disable no-unused-expressions */

const expect = require("chai").expect;
const sinon = require("sinon");
const chalk = require("chalk");
const chalkbars = require("../main");

const verifyFormat = function(){
  const args = Array.prototype.slice.call(arguments);
  const expected = args.pop();

  expect(chalkbars.format.apply(this, args)).to.equal(expected);
};

process.stdout.columns = 80;

describe("chalkbars.format", () => {
  describe("arguments handling", () => {
    it("should return a empty string when no arguments are given", () => {
      verifyFormat("");
      verifyFormat("", "");
    });

    it("should style using arguments and invoking chalk", () => {
      verifyFormat("{{#C \"red\"}}MESSAGE{{/C}}", chalk.red("MESSAGE"));
      verifyFormat("{{#C \"red\" \"yellow\"}}MESSAGE{{/C}}", chalk.red.yellow("MESSAGE"));
      verifyFormat("{{#C \"red yellow\"}}MESSAGE{{/C}}", chalk.red.yellow("MESSAGE"));
      verifyFormat("{{#C \"red\" yellow}}MESSAGE{{/C}}", chalk.red("MESSAGE"));
      verifyFormat("{{#C \"red\"}}MESSAGE{{#C \"yellow\"}}INNER{{/C}}RESTORE{{/C}}", chalk.red(`MESSAGE${chalk.yellow("INNER")}RESTORE`));
    });

    it("should concatenate styles, using characters differen than letters, numbers, dashes, pounds and underscores as separator", () => {
      verifyFormat("{{#C bgGreen.underline}}MESSAGE{{/C}}", chalk.bgGreen.underline("MESSAGE"));
      verifyFormat("{{#C bgGreen$underline}}MESSAGE{{/C}}", chalk.bgGreen.underline("MESSAGE"));
      verifyFormat("{{#C bgGreen@underline}}MESSAGE{{/C}}", chalk.bgGreen.underline("MESSAGE"));
      verifyFormat("{{#C bgGreen/underline}}MESSAGE{{/C}}", chalk.bgGreen.underline("MESSAGE"));
      verifyFormat("{{#C bgGreen.underline@bold}}MESSAGE{{/C}}", chalk.bgGreen.underline.bold("MESSAGE"));
    });

    it("should concatenate arguments, using the last as context", () => {
      verifyFormat(
        "{{#C red}}{{field}}{{/C}}", null, "{{#C green}}{{otherField}}{{/C}}", {field: "FIELD", otherField: "OTHER"},
        `${chalk.red("FIELD")}null${chalk.green("OTHER")}`
      );
    });
  });

  describe("error handling", () => {
    it("should return the source string unparsed when silent mode is enabled", () => {
      chalkbars.configuration.silent = true;
      verifyFormat("{{#C custom}}MESSAGE", "{{#C custom}}MESSAGE");
    });

    it("should throw the exception when silent mode is disabled", () => {
      chalkbars.configuration.silent = false;

      const wrapper = function(){
        chalkbars.format("{{#C custom}}MESSAGE");
      };

      expect(wrapper).to.throw(/Parse error on line 1/);

      chalkbars.configuration.silent = true;
    });
  });

  describe("color handling", () => {
    it("should handle 8-bit color codes", () => {
      verifyFormat("{{#C i#196 I#046}}MESSAGE{{/C}}", "\x1b[48;5;046m\x1b[38;5;196mMESSAGE\x1b[39m\x1b[49m");
      verifyFormat("{{#C x#500 X#050}}MESSAGE{{/C}}", "\x1b[48;5;46m\x1b[38;5;196mMESSAGE\x1b[39m\x1b[49m");
    });

    it("should handle 24-bit color codes", () => {
      verifyFormat("{{#C h#FF0000 H#00FF00}}MESSAGE{{/C}}", "\x1b[48;2;0;255;0m\x1b[38;2;255;0;0mMESSAGE\x1b[39m\x1b[49m");
    });
  });
});

describe("chalkbars.style", () => {
  it("should allow to fetch existing style", () => {
    expect(chalkbars.style()).to.not.exist;
    expect(chalkbars.style("")).to.not.exist;
    expect(chalkbars.style("bracket")).to.equal("bold blue");
  });

  it("should allow to fetch existing style", () => {
    chalkbars.style("new-style-1", "red");
    expect(chalkbars.style("new-style-1")).to.equal("red");
    chalkbars.style("new-style-1", "green");
    expect(chalkbars.style("new-style-1")).to.equal("green");
  });

  it("should allow to remove a style", () => {
    chalkbars.style("new-style-1", "red");
    chalkbars.style("new-style-2", "green");
    chalkbars.style("new-style-3", "blue");

    expect(chalkbars.style("new-style-1", null)).to.equal("red");
    expect(chalkbars.style("new-style-2", "")).to.equal("green");
    expect(chalkbars.style("new-style-3", false)).to.equal("blue");

    expect(chalkbars.style("new-style-1")).to.not.exist;
    expect(chalkbars.style("new-style-2")).to.not.exist;
    expect(chalkbars.style("new-style-3")).to.not.exist;
  });

  it("should NOT allow to shadow a chalk style", () => {
    const wrapper = function(){
      chalkbars.style("red", "yellow");
    };

    expect(wrapper).to.throw(/Cannot use "red" as a custom style name as it would shadow a chalk style/);
  });

  it("should NOT allow to define nested styles", () => {
    const wrapper = function(){
      chalkbars.style("new-style-2", "bracket");
    };

    expect(wrapper).to.throw(/Nesting of custom styles is not supported/);
  });

  it("should NOT allow values different from string", () => {
    const wrapper = function(){
      chalkbars.style("new-style-2", {a: 1});
    };

    expect(wrapper).to.throw(/Only strings are supported a values for styles/);
  });

  it("should resolve styles in templates", () => {
    verifyFormat("{{#C \"bracket-2\"}}MESSAGE{{/C}}", "MESSAGE");
    verifyFormat("{{#C \"bracket\"}}MESSAGE{{/C}}", chalk.bold.blue("MESSAGE"));
  });

  it("should have a list of default styles", () => {
    verifyFormat("{{#C \"highlight\"}}MESSAGE{{/C}}", "\x1b[1m\x1b[38;5;45mMESSAGE\x1b[39m\x1b[22m");
    verifyFormat("{{#C \"bracket\"}}MESSAGE{{/C}}", chalk.bold.blue("MESSAGE"));
    verifyFormat("{{#C \"info\"}}MESSAGE{{/C}}", chalk.bold.white("MESSAGE"));
    verifyFormat("{{#C \"skip\"}}MESSAGE{{/C}}", chalk.bold.gray("MESSAGE"));
    verifyFormat("{{#C \"ok\"}}MESSAGE{{/C}}", chalk.bold.green("MESSAGE"));
    verifyFormat("{{#C \"success\"}}MESSAGE{{/C}}", chalk.bold.green("MESSAGE"));
    verifyFormat("{{#C \"warn\"}}MESSAGE{{/C}}", chalk.bold.yellow("MESSAGE"));
    verifyFormat("{{#C \"fatal\"}}MESSAGE{{/C}}", chalk.bold.red("MESSAGE"));
    verifyFormat("{{#C \"fail\"}}MESSAGE{{/C}}", chalk.bold.red("MESSAGE"));
    verifyFormat("{{#C \"error\"}}MESSAGE{{/C}}", chalk.bold.red("MESSAGE"));
    verifyFormat("{{#C \"pass\"}}MESSAGE{{/C}}", chalk.bold.magenta("MESSAGE"));
    verifyFormat("{{#C \"debug\"}}MESSAGE{{/C}}", "\x1b[1m\x1b[38;5;127mMESSAGE\x1b[39m\x1b[22m");
  });
});

describe("chalkbars.formatNoColor", () => {
  it("should apply format and remove colors", () => {
    expect(chalkbars.formatNoColor("{{#C red}}{{field}}{{/C}}", {field: "FIELD"})).to.equal("FIELD");
    expect(chalkbars.formatNoColor("{{B warn}} Message {{E skip}}")).to.equal("[ WARN] Message \n\x1b[1A\x1b[74C[SKIP]");
  });
});

describe("chalkbars.plainFormat", () => {
  it("should apply format and remove all ANSI escapes", () => {
    expect(chalkbars.plainFormat("{{#C red}}{{field}}{{/C}}", {field: "FIELD"})).to.equal("FIELD");
    expect(chalkbars.plainFormat("{{B warn}} Message {{E skip}}")).to.equal("[ WARN] Message \n[SKIP]");
  });
});

describe("chalkbars.log", () => {
  it("should apply chalkbars and then log it to the console", () => {
    const stub = sinon.stub(console, "log");

    chalkbars.log("{{#C red}}{{field}}{{/C}}", {field: "FIELD"});
    chalkbars.log("{{B warn}} Message {{E skip}}");

    expect(stub.withArgs(chalk.red("FIELD")).calledOnce).to.be.true;
    expect(stub.withArgs(chalkbars.format("{{B warn}} Message {{E skip}}")).calledOnce).to.be.true;

    stub.restore();
  });
});

describe("chalkbars.error", () => {
  it("should apply chalkbars and then log it to the console error", () => {
    const stub = sinon.stub(console, "error");

    chalkbars.error("{{#C red}}{{field}}{{/C}}", {field: "FIELD"});
    chalkbars.error("{{B warn}} Message {{E skip}}");

    expect(stub.withArgs(chalk.red("FIELD")).calledOnce).to.be.true;
    expect(stub.withArgs(chalkbars.format("{{B warn}} Message {{E skip}}")).calledOnce).to.be.true;

    stub.restore();
  });
});

describe("chalkbars handlebars helpers", () => {
  describe("B", () => {
    it("should display a banner", () => {
      verifyFormat("{{B}}", "");
      verifyFormat("{{B other}}", chalk.bold.blue("[") + chalk.bold("OTHER") + chalk.bold.blue("]"));
      verifyFormat("{{B info}}", chalk.bold.blue("[") + chalk.bold.white(" INFO") + chalk.bold.blue("]"));
      verifyFormat("{{B info red}}", chalk.bold.blue("[") + chalk.bold.white.red("INFO RED") + chalk.bold.blue("]"));
      verifyFormat("{{B \"info\" \"red\"}}", chalk.bold.blue("[") + chalk.red(" INFO") + chalk.bold.blue("]"));
    });

    describe("should support common shortcuts", () => {
      const shortcuts = {BI: "info", BW: "warn", BO: "ok", BF: "fail", BE: "error", BP: "pass", BS: "skip", BD: "debug"};

      Object.keys(shortcuts).forEach(shortcut => {
        it(shortcut, () => {
          verifyFormat(`{{${shortcut}}}`, chalkbars.format(`{{B ${shortcuts[shortcut]}}}`));
        });
      });
    });
  });

  describe("E", () => {
    it("should display a footer", () => {
      verifyFormat("{{E}}", "");
      verifyFormat("{{E ok}}", `\n\x1b[1A\x1b[74C${chalk.bold.blue("[")}${chalk.bold.green(" OK ")}${chalk.bold.blue("]")}`);
      verifyFormat("{{E o}}", `\n\x1b[1A\x1b[74C${chalk.bold.blue("[")}${chalk.bold.green(" O  ")}${chalk.bold.blue("]")}`);
      verifyFormat("{{E ooo}}", `\n\x1b[1A\x1b[74C${chalk.bold.blue("[")}${chalk.bold.green(" OOO")}${chalk.bold.blue("]")}`);
      verifyFormat("{{E ok red}}", `\n\x1b[1A\x1b[72C${chalk.bold.blue("[")}${chalk.bold.green.red("OK RED")}${chalk.bold.blue("]")}`);
      verifyFormat("{{E \"ok\" \"red\"}}", `\n\x1b[1A\x1b[74C${chalk.bold.blue("[")}${chalk.red(" OK ")}${chalk.bold.blue("]")}`);
      verifyFormat(
        "This is another message {{E ok}}",
        `This is another message \n\x1b[1A\x1b[74C${chalk.bold.blue("[")}${chalk.bold.green(" OK ")}${chalk.bold.blue("]")}`
      );
      verifyFormat(
        "This is another message {{E \"warn\" \"green\"}}",
        `This is another message \n\x1b[1A\x1b[74C${chalk.bold.blue("[")}${chalk.green("WARN")}${chalk.bold.blue("]")}`
      );
    });

    describe("should support common shortcuts", () => {
      const shortcuts = {EI: "info", EW: "warn", EO: "ok", EF: "fail", EE: "error", EP: "pass", ES: "skip", ED: "debug"};

      Object.keys(shortcuts).forEach(shortcut => {
        it(shortcut, () => {
          verifyFormat(`{{${shortcut}}}`, chalkbars.format(`{{E ${shortcuts[shortcut]}}}`));
        });
      });
    });
  });

  it("B and E should use set brackets", () => {
    const oldOpening = chalkbars.configuration.openingBracket;
    const oldClosing = chalkbars.configuration.closingBracket;

    chalkbars.configuration.openingBracket = "(";
    chalkbars.configuration.closingBracket = ")";

    verifyFormat(
      "{{B warn}} Message {{E skip}}",
      `(${chalk.bold.yellow(" WARN")}) Message \n\x1b[1A\x1b[74C(${chalk.bold.gray("SKIP")})`
    );

    chalkbars.configuration.openingBracket = oldOpening;
    chalkbars.configuration.closingBracket = oldClosing;
  });
});

/* eslint-enable no-unused-expressions */
