//
// This file is part of the chalkbars node module. Copyright (C) 2015 and above Shogun <shogun@cowtech.it>.
// Licensed under the MIT license, which can be found at http://www.opensource.org/licenses/mit-license.php.
//

module.exports = {
  styles: {
    "bracket": "bold x#013",
    "info": "bold white",
    "highlight": "bold white",
    "skip": "bold gray",
    "ok": "bold green",
    "success": "bold green",
    "warn": "bold yellow",
    "fail": "bold red",
    "error": "bold red",
    "pass": "bold magenta",
    "debug": "bold x#045",
    "skip": "bold gray"
  },
  headerShortcuts: {
    'BI': 'info',
    'BW': 'warn',
    'BO': 'success',
    'BF': 'fail',
    'BE': 'error',
    'BP': 'pass',
    'BS': 'skip',
    'BD': 'debug'
  },
  footerShortcuts: {
    'EI': 'info',
    'EW': 'warn',
    'EO': 'ok',
    'EF': 'fail',
    'EE': 'error',
    'EP': 'pass',
    'ES': 'skip',
    'ED': 'debug'
  },
  silent: true,
  openingBracket: '{{#C bracket}}[{{/C}}',
  closingBracket: '{{#C bracket}}]{{/C}}'
};
