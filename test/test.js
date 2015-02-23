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
      expect(chalkbars.$('{{#C "red"}}MESSAGE{{/C}}')).to.equal('\x1b[31mMESSAGE\x1b[39m');
      expect(chalkbars.$('{{#C "red" "yellow"}}MESSAGE{{/C}}')).to.equal('\x1b[33m\x1b[31mMESSAGE\x1b[33m\x1b[39m');
      expect(chalkbars.$('{{#C "red" yellow}}MESSAGE{{/C}}')).to.equal('\x1b[31mMESSAGE\x1b[39m');
      expect(chalkbars.$('{{#C "red"}}MESSAGE{{#C "yellow"}}INNER{{/C}}RESTORE{{/C}}')).to.equal('\x1b[31mMESSAGE\x1b[33mINNER\x1b[31mRESTORE\x1b[39m')
    });

    it('should concatenate arguments, using the last as context', function(){
      expect(chalkbars.$('{{#C bgGreen.underline}}MESSAGE{{/C}}', null, '{{#C blue}}OTHER{{/C}}')).to.equal('\x1b[4m\x1b[42mMESSAGE\x1b[49m\x1b[24mnull\x1b[34mOTHER\x1b[39m');
    });

    it('should concatenate arguments, using the last as context', function(){
      expect(chalkbars.$('{{#C red}}{{field}}{{/C}}', '{{#C green}}{{otherField}}{{/C}}', {field: 'FIELD', otherField: 'OTHER'})).to.equal('\x1b[31mFIELD\x1b[39m\x1b[32mOTHER\x1b[39m');
    });
  });

  describe('error handling', function(){
    it('should return the source string unparsed when silent mode is enabled', function(){
      chalkbars.configuration.silent = true;
      expect(chalkbars.$('{{#C custom}}MESSAGE')).to.equal('{{#C custom}}MESSAGE');
    });

    it('should throw the exception when silent mode is disabled', function(){
      chalkbars.configuration.silent = false;
      expect(chalkbars.$).withArgs('{{#C custom}}MESSAGE').to.throwException();
      chalkbars.configuration.silent = true;
    });
  });

  describe('color handling', function(){
    it('should handle 8-bit color codes', function(){
      expect(chalkbars.$('{{#C i#196 I#046}}MESSAGE{{/C}}')).to.equal('\x1b[48;5;046m\x1b[38;5;196mMESSAGE\x1b[39m\x1b[49m');
      expect(chalkbars.$('{{#C x#500 X#050}}MESSAGE{{/C}}')).to.equal('\x1b[48;5;46m\x1b[38;5;196mMESSAGE\x1b[39m\x1b[49m');
    });

    it('should handle 24-bit color codes', function(){
      expect(chalkbars.$('{{#C h#FF0000 H#00FF00}}MESSAGE{{/C}}')).to.equal('\x1b[48;2;0;255;0m\x1b[38;2;255;0;0mMESSAGE\x1b[39m\x1b[49m');

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
    expect(chalkbars.$('{{#C "bracket-2"}}MESSAGE{{/C}}')).to.equal('MESSAGE');
    expect(chalkbars.$('{{#C "bracket"}}MESSAGE{{/C}}')).to.equal('\x1b[1m\x1b[38;5;25mMESSAGE\x1b[39m\x1b[22m');
  });

  it("should have a list of default styles", function(){
    expect(chalkbars.$('{{#C "bracket"}}MESSAGE{{/C}}')).to.equal('\x1b[1m\x1b[38;5;25mMESSAGE\x1b[39m\x1b[22m');
    expect(chalkbars.$('{{#C "info"}}MESSAGE{{/C}}')).to.equal('\x1b[37m\x1b[1mMESSAGE\x1b[22m\x1b[39m');
    expect(chalkbars.$('{{#C "highlight"}}MESSAGE{{/C}}')).to.equal('\x1b[37m\x1b[1mMESSAGE\x1b[22m\x1b[39m');
    expect(chalkbars.$('{{#C "skip"}}MESSAGE{{/C}}')).to.equal('\x1b[90m\x1b[1mMESSAGE\x1b[22m\x1b[39m');
    expect(chalkbars.$('{{#C "ok"}}MESSAGE{{/C}}')).to.equal('\x1b[32m\x1b[1mMESSAGE\x1b[22m\x1b[39m');
    expect(chalkbars.$('{{#C "success"}}MESSAGE{{/C}}')).to.equal('\x1b[32m\x1b[1mMESSAGE\x1b[22m\x1b[39m');
    expect(chalkbars.$('{{#C "warn"}}MESSAGE{{/C}}')).to.equal('\x1b[33m\x1b[1mMESSAGE\x1b[22m\x1b[39m');
    expect(chalkbars.$('{{#C "fail"}}MESSAGE{{/C}}')).to.equal('\x1b[31m\x1b[1mMESSAGE\x1b[22m\x1b[39m');
    expect(chalkbars.$('{{#C "error"}}MESSAGE{{/C}}')).to.equal('\x1b[31m\x1b[1mMESSAGE\x1b[22m\x1b[39m');
    expect(chalkbars.$('{{#C "pass"}}MESSAGE{{/C}}')).to.equal('\x1b[35m\x1b[1mMESSAGE\x1b[22m\x1b[39m');
    expect(chalkbars.$('{{#C "debug"}}MESSAGE{{/C}}')).to.equal('\x1b[1m\x1b[38;5;45mMESSAGE\x1b[39m\x1b[22m');
  });
});

describe('chalkbars handlebars helpers', function(){
  describe('B', function(){
    it("should display a banner", function(){
      expect(chalkbars.$('{{B info}}')).to.equal('\x1b[1m\x1b[38;5;25m[\x1b[39m\x1b[22m\x1b[1m\x1b[37m\x1b[1m INFO\x1b[1m\x1b[39m\x1b[22m\x1b[1m\x1b[38;5;25m]\x1b[39m\x1b[22m');
      expect(chalkbars.$('{{B info red}}')).to.equal('\u001b[1m\u001b[38;5;25m[\u001b[39m\u001b[22m\u001b[1m\u001b[31m\u001b[37m\u001b[1mINFO RED\u001b[1m\u001b[31m\u001b[39m\u001b[22m\u001b[1m\u001b[38;5;25m]\u001b[39m\u001b[22m');
      expect(chalkbars.$('{{B "info" "red"}}')).to.equal('\x1b[1m\x1b[38;5;25m[\x1b[39m\x1b[22m\x1b[1m\x1b[31m INFO\x1b[39m\x1b[22m\x1b[1m\x1b[38;5;25m]\x1b[39m\x1b[22m');
    });

    describe("should support common shortcuts", function(){
      var shortcuts = {'BI': 'info', 'BW': 'warn', 'BO': 'success', 'BF': 'fail', 'BE': 'error', 'BP': 'pass', 'BS': 'skip', 'BD': 'debug'};

      for(var shortcut in shortcuts){
        it(shortcut, function(){
          expect(chalkbars.$('{{' + shortcut + '}}')).to.equal(chalkbars.$('{{B ' + shortcuts[shortcut] + '}}'));
        });
      }
    });
  });

  describe('E', function(){
    it("should display a footer", function(){
      expect(chalkbars.$('{{E ok}}')).to.equal('\n\x1b[1A\x1b[230C\x1b[1m\x1b[38;5;25m[\x1b[39m\x1b[22m\x1b[1m\x1b[32m\x1b[1m OK \x1b[1m\x1b[39m\x1b[22m\x1b[1m\x1b[38;5;25m]\x1b[39m\x1b[22m');
      expect(chalkbars.$('{{E o}}')).to.equal('\n\x1b[1A\x1b[230C\x1b[1m\x1b[38;5;25m[\x1b[39m\x1b[22m\x1b[1m O  \x1b[22m\x1b[1m\x1b[38;5;25m]\x1b[39m\x1b[22m');
      expect(chalkbars.$('{{E ooo}}')).to.equal('\n\x1b[1A\x1b[230C\x1b[1m\x1b[38;5;25m[\x1b[39m\x1b[22m\x1b[1m OOO\x1b[22m\x1b[1m\x1b[38;5;25m]\x1b[39m\x1b[22m');
      expect(chalkbars.$('{{E ok red}}')).to.equal('\n\x1b[1A\x1b[228C\x1b[1m\x1b[38;5;25m[\x1b[39m\x1b[22m\x1b[1m\x1b[31m\x1b[32m\x1b[1mOK RED\x1b[1m\x1b[31m\x1b[39m\x1b[22m\x1b[1m\x1b[38;5;25m]\x1b[39m\x1b[22m');
      expect(chalkbars.$('{{E "ok" "red"}}')).to.equal('\n\x1b[1A\x1b[230C\x1b[1m\x1b[38;5;25m[\x1b[39m\x1b[22m\x1b[1m\x1b[31m OK \x1b[39m\x1b[22m\x1b[1m\x1b[38;5;25m]\x1b[39m\x1b[22m');
      expect(chalkbars.$('This is a another message {{E ok}}')).to.equal('This is a another message \n\x1b[1A\x1b[230C\x1b[1m\x1b[38;5;25m[\x1b[39m\x1b[22m\x1b[1m\x1b[32m\x1b[1m OK \x1b[1m\x1b[39m\x1b[22m\x1b[1m\x1b[38;5;25m]\x1b[39m\x1b[22m');
      expect(chalkbars.$('This is a another message {{E "warn" "green"}}')).to.equal('This is a another message \n\x1b[1A\x1b[230C\x1b[1m\x1b[38;5;25m[\x1b[39m\x1b[22m\x1b[1m\x1b[32mWARN\x1b[39m\x1b[22m\x1b[1m\x1b[38;5;25m]\x1b[39m\x1b[22m');
    });

    describe("should support common shortcuts", function(){
      var shortcuts = {'EI': 'info', 'EW': 'warn', 'EO': 'ok', 'EF': 'fail', 'EE': 'error', 'EP': 'pass', 'ES': 'skip', 'ED': 'debug'};

      for(var shortcut in shortcuts){
        it(shortcut, function(){
          expect(chalkbars.$('{{' + shortcut + '}}')).to.equal(chalkbars.$('{{E ' + shortcuts[shortcut] + '}}'));
        });
      }
    });
  });

  it('B and E should use set brackets', function(){
    var oldOpening = chalkbars.configuration.openingBracket;
    var oldClosing = chalkbars.configuration.closingBracket;

    chalkbars.configuration.openingBracket = "(";
    chalkbars.configuration.closingBracket = ")";

    expect(chalkbars.$('{{B info}} Message {{E ok}}')).to.equal('(\u001b[1m\u001b[37m\u001b[1m INFO\u001b[1m\u001b[39m\u001b[22m) Message \n\u001b[1A\u001b[230C(\u001b[1m\u001b[32m\u001b[1m OK \u001b[1m\u001b[39m\u001b[22m)');

    chalkbars.configuration.openingBracket = oldOpening;
    chalkbars.configuration.closingBracket = oldClosing;
  });

});
