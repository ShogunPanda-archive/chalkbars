# chalkbars

[![Gem Version](https://badge.fury.io/js/chalkbars.png)](http://badge.fury.io/js/chalkbars)
[![Dependency Status](https://gemnasium.com/ShogunPanda/chalkbars.png?travis)](https://gemnasium.com/ShogunPanda/chalkbars)
[![Build Status](https://secure.travis-ci.org/ShogunPanda/chalkbars.png?branch=master)](http://travis-ci.org/ShogunPanda/chalkbars)
[![Code Climate](https://codeclimate.com/github/ShogunPanda/chalkbars.png)](https://codeclimate.com/github/ShogunPanda/chalkbars)
[![Coverage Status](https://coveralls.io/repos/ShogunPanda/chalkbars/badge.png)](https://coveralls.io/r/ShogunPanda/chalkbars)

Template based terminal coloring based on [Chalk](https://www.npmjs.com/package/chalk) and [Handlebars](http://handlebarsjs.com).

http://sw.cowtech.it/chalkbars

## Usage

Chalkbars allows an easier use of chalk on the console taking advantage of the awesome Handlebars templating engine.

The use is really easy:

```javascript
var chalkbars = require("chalkbars").format;
console.log(chalkbars("{{#C red}}This is in red{{/C}} and this is not."));
```

## Supported implementations.

Chalkbars supports and has been tested on [NodeJS](http://nodejs.org) 0.10+ and [io.js](http://iojs.org) 1.0+. 

## Chalkbars Handlebars helpers

### C

This is the main template. It accepts one or more styles, concatenated by any character except letters, numbers and "#". 

Even thought quotes are optional, is advised to always provide them for clarity.

This template will replace text inside with the styles provided. 

It supports nesting.

Examples:

```javascript
console.log(chalkbars("{{#C red}}This is in red except for {{#C green}}this{{/C}} and it supports restoring.{{/C}}"));
console.log(chalkbars("{{#C red.bgYellow}}This is in red with a yellow background.{{/C}}"));
console.log(chalkbars("{{#C red$bgYellow}}Same as above.{{/C}}"));
```

Supported styles are:

* Default Chalk styles.
* _i#_**ABC** (where ABC is a 3 digit number): The ANSI color code. Example: **031** is red foreground, **042** is green background.
* _x#_**ABC** (where A, B, C are a number from 0 to 5): The 256 ANSI color code. For the meaning of the values, see [ansi-256-colors](https://github.com/jbnicolai/ansi-256-colors).
* _X#_**AABBCC** (where AA, BB, CC ranges from 00 to FF): The RGB HEX color code.
* User defined styles (see ```chalkbars.style``` below).

All unrecognized styles are ignored.

### B

Outputs a header with a word between brackets. 

It does not support nesting and does not support any embedded content.
 
It accepts one or two arguments. The first argument is the word to print, the second argument is the style. If the latter is omitted, the first word is also used as a style.
Again, quoting is optional but advised.

Examples: 

```javascript
console.log(chalkbars("{{B info}} On the left you see a white 'INFO' word inside blue brackets"));
console.log(chalkbars("{{B \"info\" \"red\"}} On the left you see a red 'INFO' word inside blue brackets"));
console.log(chalkbars("{{B info red}} Omitting quotes might lead to unwanted behavior"));
console.log(chalkbars("{{B \"what\" \"red.bgYellow\"}} On the left you see a red on yellow background 'WHAT' word inside blue brackets"));
```

#### Shortcuts

The following shortcut helpers are also defined:

* **BI**: Shortand for `{{B "info"}}`
* **BW**: Shortand for `{{B "warn"}}`
* **BO**: Shortand for `{{B "ok"}}`
* **BF**: Shortand for `{{B "fail"}}`
* **BE**: Shortand for `{{B "error"}}`
* **BP**: Shortand for `{{B "pass"}}`
* **BS**: Shortand for `{{B "skip"}}`
* **BD**: Shortand for `{{B "debug"}}`

### E

Outputs a footer with a word between brackets

It behaves like [B](#user-content-b) but it makes sure the message is printed to the right of the screen.

```javascript
console.log(chalkbars("On the right you see a white 'INFO' word inside blue brackets {{E info}}"));
console.log(chalkbars("On the right you see a red 'INFO' word inside blue brackets {{E \"info\" \"red\"}}"));
console.log(chalkbars("Omitting quotes might lead to unwanted behavior {{E info red}}"));
console.log(chalkbars("On the right you see a red on yellow background 'WHAT' word inside blue brackets {{B \"what\" \"red.bgYellow\"}}"));
```

#### Shortcuts

The following shortcut helpers are also defined:

* **EI**: Shortand for `{{E "info"}}`
* **EW**: Shortand for `{{E "warn"}}`
* **EO**: Shortand for `{{E "ok"}}`
* **EF**: Shortand for `{{E "fail"}}`
* **EE**: Shortand for `{{E "error"}}`
* **EP**: Shortand for `{{E "pass"}}`
* **ES**: Shortand for `{{E "skip"}}`
* **ED**: Shortand for `{{E "debug"}}`

## Configuring Chalkbars

### chalkbars.configuration.silent

Whether to ignore exceptions when compiling a Handlebars template fails. 

If set to `false` a compilation failure will raise an exception.

The default value is `true`.

### chalkbars.configuration.openingBracket

The default template for the opening bracket in the [B](#user-content-b) and [E](#user-content-e) templates.

The default value is `{{#C bracket}}[{{/C}}`.

### chalkbars.configuration.closingBracket

The default template for the closing bracket in the [B](#user-content-b) and [E](#user-content-e) templates.

The default value is `{{#C bracket}}]{{/C}}`.

### chalkbars.configuration.styles

The list of valid chalk styles for the [C](#user-content-c), [B](#user-content-b) and [E](#user-content-e) templates.  

**Do not modify this directly but use [chalkbars.style](#user-content-chalkbarsstylename-value) instead.**

## API Documentation

### chalkbars.format(...template, context)

It compiles the template (you can pass multiple templates, they will be concatenated) using Handlebars and applying chalk and custom styles.

If the last argument is a object, it will be passed as the context to Handlebars.

If might or not raise an exception depending on the value of `chalkbars.configuration.silent`.

Example:

```javascript
console.log(chalkbars.format("{{#C red}}This is in red{{/C}} and this is not."));
```

### chalkbars.style(name, value)

Get or sets a chalkbars style. Returns `undefined` when a style is not defined. 

When `value` is omitted, it returns the current value of the style.

When `value` is `null`, it returns the current value of the style and then deletes the style.
     
When `value` is a string, it sets the new value of the style and then returns the value itself.

Style nesting or overwriting a chalk style is not allowed.
 
Examples: 

```javascript
console.log(chalkbars.style("custom"));
// => undefined
console.log(chalkbars.style("custom", "red"));
// => "red"
console.log(chalkbars.style("custom"));
// => "red"
console.log(chalkbars.style("custom", "green"));
// => "green"
console.log(chalkbars.style("custom", null));
// => "green"
console.log(chalkbars.style("custom"));
// => undefined
```

### chalkbars.log(...template, context)

Simply a shortcut for `console.log(chalkbars.format(...));`.

### chalkbars.formatNoColor(...template, context)

It behaves like [chalkbars.format](#user-content-chalkbarsformattemplate-context) but it removes all ANSI colors escapes code before returning.

### chalkbars.plainFormat(...template, context)

It behaves like [chalkbars.format](#user-content-chalkbarsformattemplate-context) but it removes **all** ANSI escapes code before returning.

## Contributing to chalkbars

* Check out the latest master to make sure the feature hasn't been implemented or the bug hasn't been fixed yet.
* Check out the issue tracker to make sure someone already hasn't requested it and/or contributed it.
* Fork the project.
* Start a feature/bugfix branch.
* Commit and push until you are happy with your contribution.
* Make sure to add tests for it. This is important so I don't break it in a future version unintentionally.

## Copyright

Copyright (C) 2015 and above Shogun (shogun@cowtech.it).

Licensed under the MIT license, which can be found at http://opensource.org/licenses/MIT.
