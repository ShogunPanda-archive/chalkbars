//
// This file is part of the chalkbars node module. Copyright (C) 2015 and above Shogun <shogun@cowtech.it>.
// Licensed under the MIT license, which can be found at http://www.opensource.org/licenses/mit-license.php.
//

var renderTemplate = require("./lib/templating");

var chalkbars = function(){
  if(!arguments.length){
    return "";
  }

  var args = Array.prototype.slice.call(arguments, 0);

  // Get the last element and check whether is a object.
  var context = args.pop();

  if(!context || typeof context !== 'object'){
    args.push(context);
    context = {};
  }

  // Perform the handlebars compilation
  try{
    return renderTemplate(args, context);
  }catch(e){
    // If it fails we return the raw source or raise an error
    if(module.exports.configuration.silent){
      return args.join("");
    }else{
      throw e;
    }
  }
};

module.exports = {
  configuration: require("./lib/configuration"),
  $: chalkbars,
  style: require("./lib/functions").manageStyle
};
