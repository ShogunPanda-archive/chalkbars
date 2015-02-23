//
// This file is part of the chalkbars node module. Copyright (C) 2015 and above Shogun <shogun@cowtech.it>.
// Licensed under the MIT license, which can be found at http://www.opensource.org/licenses/mit-license.php.
//

// --- Requires ---
var chalk = require('chalk');
var styles = require("./configuration").styles;
var silent = require("./configuration").silent;

// --- Exports ---
module.exports = {
  parseStyles: function(styles){
    styles = styles ? styles.replace(/[^a-z0-9#_-]/ig, " ") : ""; // Replace other characters with a space

    // Replace with custom styles
    styles = styles.replace(/\S+/ig, function(style){
      return module.exports.manageStyle(style) || style;
    });

    return styles;
  },

  embedInColor: function(subject, color, type, background){
    var tags = background ? [48, 49] : [38, 39];
    return '\x1b[' + tags[0] + ';' + type + ';' + color + 'm' + subject + '\x1b[' + tags[1] + 'm';
  },

  embedIn256Color: function(subject, r, g, b, background){
    r = parseInt(r, 10) || 0;
    g = parseInt(g, 10) || 0;
    b = parseInt(b, 10) || 0;

    return module.exports.embedInColor(subject, 16 + (r * 36) + (g * 6) + b, 5, background);
  },

  embedInHexColor: function(subject, color, background){
    var tags = background ? [48, 49] : [38, 39];
    var r = parseInt(color.substring(0, 2), 16) || 0;
    var g = parseInt(color.substring(2, 4), 16) || 0;
    var b = parseInt(color.substring(4, 6), 16) || 0;

    return module.exports.embedInColor(subject, r + ";" + g + ";" + b, 2, background);
  },

  manageStyle: function(name, value){
    if(value === undefined) // Search the style
      value = styles[name];
    else if(typeof value == 'string'){ // Define a new style
      if(typeof chalk[name] == 'function')
        throw new RangeError('Cannot use "' + name + '" as a custom style name as it would shadow a chalk style.');

      // Verify that the value does not contain other styles
      value = value.replace(/[^a-z0-9#_-]/ig, " ");

      value.split(/\s+/).forEach(function(style){
        if(module.exports.manageStyle(style))
          throw new RangeError('Nesting of custom styles is not supported.');
      });

      styles[name] = value;
    }else if(value === null){ // Delete a style. We return the current style as return value
      value = styles[name];
      delete styles[name];
    }

    return value;
  },
};
