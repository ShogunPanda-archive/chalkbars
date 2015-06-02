/*
 * This file is part of the chalkbars node module. Copyright (C) 2015 and above Shogun <shogun@cowtech.it>.
 * Licensed under the MIT license, which can be found at http://www.opensource.org/licenses/mit-license.php.
 */

(function(){
  "use strict";

  // --- Requires ---
  var handlebars = require("handlebars");
  var chalk = require("chalk");
  var functions = require("./functions");
  var configuration = require("./configuration");

  var renderTemplate = function(args, context){
    // Join arguments. If all the handlebars arguments for C* are unquoted, transform it as a single quoted argument.
    var sources = args.map(function(arg){
      return typeof arg === "object" ? JSON.stringify(arg) : arg.toString();
    }).join("").replace(/\{\{(#C|B|E) ([^"].*?)\}\}/g, "{{$1 \"$2\"}}");

    // Return the handlebars compilation
    return handlebars.compile(sources)(context);
  };

  // --- Handlebars helpers ---
  handlebars.registerHelper("C", function(){
    var styles = Array.prototype.slice.call(arguments, 0);
    var options = styles.pop();
    var embedded = options.fn(this);
    var pipeline = chalk;

    functions.parseStyles(styles.join(" ")).split(/\s+/).forEach(function(style){ // Apply styles
      // Replace styles
      if(style.match(/^i#(\d{3})$/i)) // Replace 256 colors indexes
        embedded = functions.embedInColor(embedded, RegExp.$1, 5, style[0] === "I");
      else if(style.match(/^x#(\d)(\d)(\d)$/i)) // Replace 256 colors codes
        embedded = functions.embedIn256Color(embedded, RegExp.$1, RegExp.$2, RegExp.$3, style[0] === "X");
      else if(style.match(/^h#([0-9A-F]{6})$/i)) // Replace 24 bit HEX colors codes
        embedded = functions.embedInHexColor(embedded, RegExp.$1, style[0] === "H");
      else if(typeof chalk[style] === "function") // Replace chalk colors
        pipeline = pipeline[style];
    });

    return typeof pipeline === "function" ? pipeline(embedded) : embedded;
  });

  handlebars.registerHelper("B", function(){
    var tokens = Array.prototype.slice.call(arguments, 0, -1);
    var styles = tokens.pop();
    var embedded = tokens.join(" ");

    // If there was no argument, return an empty string
    if(!styles)
      return "";

    // If there was only an argument, it's both the style and the content
    if(!embedded)
      embedded = styles;

    while(embedded.length < 5)
      embedded = " " + embedded;

    // Invoke the main helper for the content
    var inner = handlebars.helpers.C(styles, { // eslint-disable-line new-cap
      fn: function(){
        return embedded.toUpperCase();
      }
    });

    // If there is no style then make it bold
    if(inner.indexOf("\x1b") === -1)
      inner = chalk.bold(inner);

    // Surround with brackets
    return renderTemplate([configuration.openingBracket]) + inner + renderTemplate([configuration.closingBracket]);
  });

  handlebars.registerHelper("E", function(){
    var tokens = Array.prototype.slice.call(arguments, 0, -1);
    var styles = tokens.pop();
    var embedded = tokens.join(" ");

    // If there was no argument, return an empty string
    if(!styles)
      return "";

    // If there was only an argument, it's both the style and the content
    if(!embedded)
      embedded = styles;

    // Make sure the text is at least 4 characters
    switch(embedded.length){
      case 1:
        embedded = " " + embedded + "  ";
        break;
      case 2:
        embedded = " " + embedded + " ";
        break;
      case 3:
        embedded = " " + embedded;
        break;
    }

    // Invoke the main helper for the content
    var inner = handlebars.helpers.C(styles, { // eslint-disable-line new-cap
      fn: function(){
        return embedded.toUpperCase();
      }
    });

    // If there is no style then make it bold green
    if(inner.indexOf("\x1b") === -1)
      inner = chalk.bold.green(inner);

    // Surround with brackets
    var footer = renderTemplate([configuration.openingBracket]) + inner + renderTemplate([configuration.closingBracket]);
    var span = process.stdout.columns - chalk.stripColor(footer).length;
    return "\n\x1b[1A\x1b[" + span + "C" + footer;
  });

  // --- Shortcuts
  Object.keys(configuration.shortcuts).forEach(function(shortcut){
    var value = configuration.shortcuts[shortcut];

    // Header
    handlebars.registerHelper("B" + shortcut, function(){
      return handlebars.helpers.B(value, {}); // eslint-disable-line new-cap
    });

    // Footer
    handlebars.registerHelper("E" + shortcut, function(){
      return handlebars.helpers.E(value, {}); // eslint-disable-line new-cap
    });
  });

  module.exports = {
    handlebars: handlebars,
    chalk: chalk,
    renderTemplate: renderTemplate
  };
})();
