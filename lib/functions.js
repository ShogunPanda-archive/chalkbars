/*
 * This file is part of the chalkbars npm package. Copyright (C) 2015 and above Shogun <shogun@cowtech.it>.
 * Licensed under the MIT license, which can be found at https://choosealicense.com/licenses/mit.
 */

const chalk = require("chalk");
const styles = require("./configuration").styles;

const HEX = 16;
const TO_RGB_R = 36;
const TO_RGB_G = 6;
const TO_RGB_TYPE = 5;
const FROM_RGB_R = 2;
const FROM_RGB_G = 4;
const FROM_RGB_B = 6;
const FOREGROUND_TAG = 38;
const BACKGROUND_TAG = 48;

module.exports = {
  parseStyles(raw){
    raw = raw.toString().replace(/[^a-z0-9#_-]/ig, " "); // Replace other characters with a space

    // Replace with custom styles
    return raw.replace(/\S+/ig, style => module.exports.manageStyle(style) || style);
  },

  embedInColor(subject, color, type, background){
    const tags = background ? [BACKGROUND_TAG, BACKGROUND_TAG + 1] : [FOREGROUND_TAG, FOREGROUND_TAG + 1];
    return `\x1b[${tags[0]};${type};${color}m${subject}\x1b[${tags[1]}m`;
  },

  embedIn256Color(subject, r, g, b, background){
    r = parseInt(r, 10) || 0;
    g = parseInt(g, 10) || 0;
    b = parseInt(b, 10) || 0;

    return module.exports.embedInColor(subject, HEX + (r * TO_RGB_R) + (g * TO_RGB_G) + b, TO_RGB_TYPE, background); // eslint-disable-line no-extra-parens
  },

  embedInHexColor(subject, color, background){
    const r = parseInt(color.substring(0, FROM_RGB_R), HEX) || 0;
    const g = parseInt(color.substring(FROM_RGB_R, FROM_RGB_G), HEX) || 0;
    const b = parseInt(color.substring(FROM_RGB_G, FROM_RGB_B), HEX) || 0;

    return module.exports.embedInColor(subject, `${r};${g};${b}`, 2, background);
  },

  /**
   * Get or sets a chalkbars style.
   *
   * @alias module:chalkbars.style
   * @param {string} name - The name of the style. It **must not** overwrite a existing chalk style.
   * @param {string|null|undefined} [value] -
   * * When omitted, it returns the current value of the style.
   * * When `null`, it returns the current value of the style and then deletes the style.
   * * When a string, it sets the new value of the style and then returns the value itself.
   *
   * @returns {string|undefined} The value of the style or `undefined`.
   */
  manageStyle(name, value){
    if(value === "")
      value = null;

    switch(typeof value){
      case "undefined": // Search the style
        value = styles[name];
        break;
      case "string": // Define a new style
        if(typeof chalk[name] === "function")
          throw new RangeError(`Cannot use "${name}" as a custom style name as it would shadow a chalk style.`);

        // Verify that the value does not contain other styles
        value = value.replace(/[^a-z0-9#_-]/ig, " ");

        value.split(/\s+/).forEach(style => {
          if(module.exports.manageStyle(style))
            throw new RangeError("Nesting of custom styles is not supported.");
        });

        styles[name] = value;
        break;
      default:
        // Null is handled here because typeof null == "object" -
        // If this if evaluates to true, then some truthy value different than a string was passed and this is not allow.
        // If this if evaluates to false, then all falsey values will result in deleting the style.
        if(value)
          throw new TypeError("Only strings are supported a values for styles.");

        // Delete a style. Return the current style as return value
        value = styles[name];
        delete styles[name]; // eslint-disable-line prefer-reflect
        break;
    }

    return value;
  }
};
