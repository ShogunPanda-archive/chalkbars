//
// This file is part of the chalkbars node module. Copyright (C) 2015 and above Shogun <shogun@cowtech.it>.
// Licensed under the MIT license, which can be found at http://www.opensource.org/licenses/mit-license.php.
//

var expect = require('expect.js');
var chalkbars = require('../main');

describe('chalkbars.$', function(){
  describe('arguments handling', function(){
    it('should return a empty string when no arguments are give', function(){
      expect(chalkbars.$()).to.equal('');
      expect(chalkbars.$('')).to.equal('');
    });

    it('should style using arguments and invoking chalk', function(){
      expect(chalkbars.$('{{#cb "red"}}MESSAGE{{/cb}}')).to.equal('\x1b[31mMESSAGE\x1b[39m');
      expect(chalkbars.$('{{#cb "red" "yellow"}}MESSAGE{{/cb}}')).to.equal('\x1b[33m\x1b[31mMESSAGE\x1b[33m\x1b[39m');
      expect(chalkbars.$('{{#cb "red" yellow}}MESSAGE{{/cb}}')).to.equal('\x1b[31mMESSAGE\x1b[39m');
      expect(chalkbars.$('{{#cb "red"}}MESSAGE{{#cb "yellow"}}INNER{{/cb}}RESTORE{{/cb}}')).to.equal('\x1b[31mMESSAGE\x1b[33mINNER\x1b[31mRESTORE\x1b[39m')
    });

    it('should concatenate arguments, using the last as context', function(){
      expect(chalkbars.$('{{#cb bgGreen.underline}}MESSAGE{{/cb}}', null, '{{#cb blue}}OTHER{{/cb}}')).to.equal('\x1b[4m\x1b[42mMESSAGE\x1b[49m\x1b[24mnull\x1b[34mOTHER\x1b[39m');
    });

    it('should concatenate arguments, using the last as context', function(){
      expect(chalkbars.$('{{#cb red}}{{field}}{{/cb}}', '{{#cb green}}{{otherField}}{{/cb}}', {field: 'FIELD', otherField: 'OTHER'})).to.equal('\x1b[31mFIELD\x1b[39m\x1b[32mOTHER\x1b[39m');
    });
  });

  describe('error handling', function(){
    it('should return the source string unparsed when silent mode is enabled', function(){
      chalkbars.configuration.silent = true;
      expect(chalkbars.$('{{#cb custom}}MESSAGE')).to.equal('{{#cb custom}}MESSAGE');
    });

    it('should throw the exception when silent mode is disabled', function(){
      chalkbars.configuration.silent = false;
      expect(chalkbars.$).withArgs('{{#cb custom}}MESSAGE').to.throwException();
      chalkbars.configuration.silent = true;
    });
  });

  describe('color handling', function(){
    it('should handle 8-bit color codes', function(){
      expect(chalkbars.$('{{#cb i#196 I#046}}MESSAGE{{/cb}}')).to.equal('\x1b[48;5;046m\x1b[38;5;196mMESSAGE\x1b[39m\x1b[49m');
      expect(chalkbars.$('{{#cb x#500 X#050}}MESSAGE{{/cb}}')).to.equal('\x1b[48;5;46m\x1b[38;5;196mMESSAGE\x1b[39m\x1b[49m');
    });

    it('should handle 24-bit color codes', function(){
      expect(chalkbars.$('{{#cb h#FF0000 H#00FF00}}MESSAGE{{/cb}}')).to.equal('\x1b[48;2;0;255;0m\x1b[38;2;255;0;0mMESSAGE\x1b[39m\x1b[49m');

    });
  });
});

describe('chalkbars.style', function(){
  it('should allow to fetch existing style', function(){
    expect(chalkbars.style()).to.equal(undefined);
    expect(chalkbars.style('')).to.equal(undefined);
    expect(chalkbars.style('bracket')).to.equal('bold x#013');
  });

  it('should allow to fetch existing style', function(){
    chalkbars.style('new-style-1', 'red')
    expect(chalkbars.style('new-style-1')).to.equal('red');
    chalkbars.style('new-style-1', 'green')
    expect(chalkbars.style('new-style-1')).to.equal('green');
  });

  it('should allow to remove a style', function(){
    chalkbars.style('new-style-1', 'red');
    expect(chalkbars.style('new-style-1', null)).to.equal('red');
    expect(chalkbars.style('new-style-1')).to.equal(undefined);
  });

  it('should NOT allow to shadow a chalk style', function(){
    expect(chalkbars.style).withArgs('red', 'yellow').to.throwException(/Cannot use "red" as a custom style name as it would shadow a chalk style./);
  });

  it('should NOT allow to INNERine nested styles', function(){
    expect(chalkbars.style).withArgs('new-style-2', 'bracket').to.throwException(/Nesting of custom styles is not supported./);
  });

  it('should resolve styles in templates', function(){
    expect(chalkbars.$('{{#cb "bracket-2"}}MESSAGE{{/cb}}')).to.equal('MESSAGE');
    expect(chalkbars.$('{{#cb "bracket"}}MESSAGE{{/cb}}')).to.equal('\x1b[1m\x1b[38;5;25mMESSAGE\x1b[39m\x1b[22m');
  });

  it("should have a list of default styles", function(){
    expect(chalkbars.$('{{#cb "bracket"}}MESSAGE{{/cb}}')).to.equal('\x1b[1m\x1b[38;5;25mMESSAGE\x1b[39m\x1b[22m');
    expect(chalkbars.$('{{#cb "info"}}MESSAGE{{/cb}}')).to.equal('\x1b[37m\x1b[1mMESSAGE\x1b[22m\x1b[39m');
    expect(chalkbars.$('{{#cb "highlight"}}MESSAGE{{/cb}}')).to.equal('\x1b[37m\x1b[1mMESSAGE\x1b[22m\x1b[39m');
    expect(chalkbars.$('{{#cb "skip"}}MESSAGE{{/cb}}')).to.equal('\x1b[90m\x1b[1mMESSAGE\x1b[22m\x1b[39m');
    expect(chalkbars.$('{{#cb "ok"}}MESSAGE{{/cb}}')).to.equal('\x1b[32m\x1b[1mMESSAGE\x1b[22m\x1b[39m');
    expect(chalkbars.$('{{#cb "success"}}MESSAGE{{/cb}}')).to.equal('\x1b[32m\x1b[1mMESSAGE\x1b[22m\x1b[39m');
    expect(chalkbars.$('{{#cb "warn"}}MESSAGE{{/cb}}')).to.equal('\x1b[33m\x1b[1mMESSAGE\x1b[22m\x1b[39m');
    expect(chalkbars.$('{{#cb "fail"}}MESSAGE{{/cb}}')).to.equal('\x1b[31m\x1b[1mMESSAGE\x1b[22m\x1b[39m');
    expect(chalkbars.$('{{#cb "error"}}MESSAGE{{/cb}}')).to.equal('\x1b[31m\x1b[1mMESSAGE\x1b[22m\x1b[39m');
    expect(chalkbars.$('{{#cb "pass"}}MESSAGE{{/cb}}')).to.equal('\x1b[35m\x1b[1mMESSAGE\x1b[22m\x1b[39m');
    expect(chalkbars.$('{{#cb "debug"}}MESSAGE{{/cb}}')).to.equal('\x1b[1m\x1b[38;5;45mMESSAGE\x1b[39m\x1b[22m');
  });
});

describe('chalkbars handlebars helpers', function(){
  describe('cbh', function(){
    it("should display a banner", function(){
      expect(chalkbars.$('{{cbh info}}')).to.equal('\x1b[1m\x1b[38;5;25m[\x1b[39m\x1b[22m\x1b[1mINFO\x1b[22m\x1b[1m\x1b[38;5;25m]\x1b[39m\x1b[22m');
      expect(chalkbars.$('{{cbh info red}}')).to.equal('\x1b[1m\x1b[38;5;25m[\x1b[39m\x1b[22m\x1b[1mINFO RED\x1b[22m\x1b[1m\x1b[38;5;25m]\x1b[39m\x1b[22m');
      expect(chalkbars.$('{{cbh "info" "red"}}')).to.equal('\x1b[1m\x1b[38;5;25m[\x1b[39m\x1b[22m\x1b[1m\x1b[31mINFO\x1b[39m\x1b[22m\x1b[1m\x1b[38;5;25m]\x1b[39m\x1b[22m');
    });
  });

  describe('cbf', function(){
    it("should display a footer", function(){
      expect(chalkbars.$('{{cbf ok}}')).to.equal('\n\x1b[1A\x1b[230C\x1b[1m\x1b[38;5;25m[\x1b[39m\x1b[22m\x1b[1m\x1b[32m\x1b[1m OK \x1b[1m\x1b[39m\x1b[22m\x1b[1m\x1b[38;5;25m]\x1b[39m\x1b[22m');
      expect(chalkbars.$('{{cbf o}}')).to.equal('\n\x1b[1A\x1b[230C\x1b[1m\x1b[38;5;25m[\x1b[39m\x1b[22m\x1b[1m O  \x1b[22m\x1b[1m\x1b[38;5;25m]\x1b[39m\x1b[22m');
      expect(chalkbars.$('{{cbf ooo}}')).to.equal('\n\x1b[1A\x1b[230C\x1b[1m\x1b[38;5;25m[\x1b[39m\x1b[22m\x1b[1m OOO\x1b[22m\x1b[1m\x1b[38;5;25m]\x1b[39m\x1b[22m');
      expect(chalkbars.$('{{cbf ok red}}')).to.equal('\n\x1b[1A\x1b[228C\x1b[1m\x1b[38;5;25m[\x1b[39m\x1b[22m\x1b[1m\x1b[31m\x1b[32m\x1b[1mOK RED\x1b[1m\x1b[31m\x1b[39m\x1b[22m\x1b[1m\x1b[38;5;25m]\x1b[39m\x1b[22m');
      expect(chalkbars.$('{{cbf "ok" "red"}}')).to.equal('\n\x1b[1A\x1b[230C\x1b[1m\x1b[38;5;25m[\x1b[39m\x1b[22m\x1b[1m\x1b[31m OK \x1b[39m\x1b[22m\x1b[1m\x1b[38;5;25m]\x1b[39m\x1b[22m');
      expect(chalkbars.$('This is a another message {{cbf ok}}')).to.equal('This is a another message \n\x1b[1A\x1b[230C\x1b[1m\x1b[38;5;25m[\x1b[39m\x1b[22m\x1b[1m\x1b[32m\x1b[1m OK \x1b[1m\x1b[39m\x1b[22m\x1b[1m\x1b[38;5;25m]\x1b[39m\x1b[22m');
      expect(chalkbars.$('This is a another message {{cbf "warn" "green"}}')).to.equal('This is a another message \n\x1b[1A\x1b[230C\x1b[1m\x1b[38;5;25m[\x1b[39m\x1b[22m\x1b[1m\x1b[32mWARN\x1b[39m\x1b[22m\x1b[1m\x1b[38;5;25m]\x1b[39m\x1b[22m');
    });
  });

  describe('cbh and cbf should use set brackets', function(){
    var oldOpening = chalkbars.configuration.openingBracket;
    var oldClosing = chalkbars.configuration.closingBracket;

    chalkbars.configuration.openingBracket = "(";
    chalkbars.configuration.closingBracket = ")";

    expect(chalkbars.$('{{cbh info}} Message {{cbf ok}}')).to.equal('(\x1b[1mINFO\x1b[22m) Message \n\x1b[1A\x1b[230C(\x1b[1m\x1b[32m\x1b[1m OK \x1b[1m\x1b[39m\x1b[22m)');

    chalkbars.configuration.openingBracket = oldOpening;
    chalkbars.configuration.closingBracket = oldClosing;
  });
});
