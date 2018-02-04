/*
 * This file is part of the chalkbars npm package. Copyright (C) 2015 and above Shogun <shogun@cowtech.it>.
 * Licensed under the MIT license, which can be found at https://choosealicense.com/licenses/mit.
 */

const chalk = require("chalk");
const templating = require("./lib/templating");
const configuration = require("./lib/configuration");
const style = require("./lib/functions").manageStyle;

/**
 * Compiles a Handlebars templates and then applies chalk colors.
 *
 * @alias module:chalkbars.format
 * @param {...string} template - The template to compile. You can specify more than one string, they will be concatenated.
 * @param {object} context - The context for the Handlebars template.
 * @returns {string} The compiled template with color styles applied.
 */
const format = function(){
  "use strict";

  const args = Array.prototype.slice.call(arguments, 0);

  if(!args.length)
    return "";

  // Get the last element and check whether is a object.
  let context = args.pop();

  if(!context || typeof context !== "object"){
    args.push(context);
    context = {};
  }

  // Perform the handlebars compilation
  try{
    return templating.renderTemplate(args, context);
  }catch(e){
    // If it fails we return the raw source or raise an error
    if(module.exports.configuration.silent)
      return args.join("");

    throw e;
  }
};

/**
 * Chalkbars module.
 *
 * @module chalkbars
 */
module.exports = {
  /**
   * The console library used by chalkbars.
   *
   * @type {object}
   */
  chalk: templating.chalk,

  /**
   * The templating library used by chalkbars.
   *
   * @type {object}
   */
  handlebars: templating.handlebars,

  configuration,

  style,

  format,

  /**
   * Compiles a Handlebars templates and then it strips out all ANSI color sequences.
   * {@see format}
   *
   * @param {...string} template - The template to compile. You can specify more than one string, they will be concatenated.
   * @param {object} context - The context for the Handlebars template.
   * @returns {string} The compiled template with color styles removed.
   */
  formatNoColor(){
    const args = Array.prototype.slice.call(arguments, 0);
    return format.apply(this, args).replace(/\u001b\[(?:[0-9]{1,3}(?:;[0-9]{1,3})*)?[m|K]/g, "");
  },

  /**
   * Compiles a Handlebars templates and then it strips out all ANSI escape sequences.
   * {@see format}
   *
   * @param {...string} template - The template to compile. You can specify more than one string, they will be concatenated.
   * @param {object} context - The context for the Handlebars template.
   * @returns {string} The compiled template with ANSI escape sequences removed.
   */
  plainFormat(){
    const args = Array.prototype.slice.call(arguments, 0);
    return chalk.stripColor(format.apply(this, args));
  },

  /**
   * Compiles a Handlebars templates and then outputs it to the console.
   * {@see format}
   *
   * @param {...string} template - The template to compile. You can specify more than one string, they will be concatenated.
   * @param {object} context - The context for the Handlebars template.
   */
  log(){
    const args = Array.prototype.slice.call(arguments, 0);
    console.log(format.apply(this, args));
  },

  /**
   * Compiles a Handlebars templates and then outputs it to the console as error.
   * {@see format}
   *
   * @param {...string} template - The template to compile. You can specify more than one string, they will be concatenated.
   * @param {object} context - The context for the Handlebars template.
   */
  error(){
    const args = Array.prototype.slice.call(arguments, 0);
    console.error(format.apply(this, args));
  }
};
