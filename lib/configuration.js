//
// This file is part of the chalkbars node module. Copyright (C) 2015 and above Shogun <shogun@cowtech.it>.
// Licensed under the MIT license, which can be found at http://www.opensource.org/licenses/mit-license.php.
//

(function(){
  "use strict";

  /* eslint-disable camelcase */
  module.exports = {
    styles: {
      highlight: "cyan",
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
      debug: "bold x#045",
      skip: "bold gray",
      // The following style resembles the normal one but they don't use bold
      light_bracket: "x#013",
      light_info: "white",
      light_ok: "green",
      light_success: "green",
      light_warn: "yellow",
      light_fatal: "red",
      light_fail: "red",
      light_error: "red",
      light_pass: "magenta",
      light_debug: "x#045",
      light_skip: "gray"
    },
    shortcuts: {
      I: "info",
      W: "warn",
      O: "success",
      F: "fail",
      E: "error",
      P: "pass",
      S: "skip",
      D: "debug"
    },
    silent: false,
    openingBracket: "{{#C bracket}}[{{/C}}",
    closingBracket: "{{#C bracket}}]{{/C}}"
  };
  /* eslint-enable camelcase */
})();
