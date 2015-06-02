/*
 * This file is part of the chalkbars node module. Copyright (C) 2015 and above Shogun <shogun@cowtech.it>.
 * Licensed under the MIT license, which can be found at http://www.opensource.org/licenses/mit-license.php.
 */

(function(){
  "use strict";

  /* eslint-disable camelcase */

  /**
   * Chalkbars configuration.
   *
   * @module chalkbars.configuration
   */
  module.exports = {
    /**
     * The list of style recognized by chalkbars.
     * It can contain any chalk style, or the following special syntaxes:
     *
     * * _i#_**ABC** (where ABC is a 3 digit number): The ANSI color code. Example: **031** is red foreground, **042** is green background.
     * * _x#_**ABC** (where A, B, C are a number from 0 to 5): The 256 ANSI color code.
     *   For the meaning of the values, see {@link https://github.com/jbnicolai/ansi-256-colors}
     * * _X#_**AABBCC** (where AA, BB, CC ranges from 00 to FF): The RGB HEX color code.
     *
     * @type {object}
     */
    styles: {
      highlight: "bold x#045",
      // Normal styles
      bracket: "bold blue",
      info: "bold white",
      ok: "bold green",
      success: "bold green",
      warn: "bold yellow",
      fatal: "bold red",
      fail: "bold red",
      error: "bold red",
      pass: "bold magenta",
      debug: "bold x#303",
      skip: "bold gray",
      // The following style resembles the normal one but they don't use bold
      light_highlight: "x#045",
      light_bracket: "x#013",
      light_info: "white",
      light_ok: "green",
      light_success: "green",
      light_warn: "yellow",
      light_fatal: "red",
      light_fail: "red",
      light_error: "red",
      light_pass: "magenta",
      light_debug: "x#303",
      light_skip: "gray"
    },
    /**
     * Whether to ignore exceptions when compiling a Handlebars template fails. If set to `false` a compilation failure will raise an exception.
     *
     *
     *
     * @type boolean
     * @default true
     */
    silent: true,
    /**
     * The default template for the opening bracket in the `B` and `E` templates.
     *
     * @type string
     * @default {{#C bracket}}[{{/C}}
     */
    openingBracket: "{{#C bracket}}[{{/C}}",
    /**
     * The default template for the closing bracket in the `B` and `E` templates.
     *
     * @type string
     * @default {{#C bracket}}]{{/C}}
     */
    closingBracket: "{{#C bracket}}]{{/C}}",
    /**
     * The list of shortcuts available in the `B` and `E` templates.
     *
     * @type {object}
     */
    shortcuts: {
      I: "info",
      W: "warn",
      O: "ok",
      F: "fail",
      E: "error",
      P: "pass",
      S: "skip",
      D: "debug"
    }
  };

  /* eslint-enable camelcase */
})();
