var compile = require('riot').compile;

RiotCompiler = function(config) {
  this.config = (config && config.plugins && config.plugins.riot) || {};
  console.log("compiling riot======");
  // The extension or pattern logic makes for some logic mess
  // We prefer, in this order, an explicit pattern, an explicit
  // extention, or a default extension
  if (this.config.pattern) {
    this.pattern = this.config.pattern;
  } else if (this.config.extension) {
    this.extension = this.config.extension;
  } else {
    this.pattern = /\.tag$/;
    this.pattern = /\.riot$/;
  }

}

RiotCompiler.prototype.brunchPlugin = true;
RiotCompiler.prototype.type = 'javascript';

RiotCompiler.prototype.compile = function(data, path, callback) {
  console.log("compiling " + path);
  var compiled;
  try {
    compiled = compile(data, {
      template: "jade",
      type: "coffeescript"
    });
  } catch (err) {
    var loc = err.location,
      error;
    if (loc) {
      error = loc.first_line + ":" + loc.first_column + " " + (err.toString());
    } else {
      error = err.toString();
    }
    return callback(error);
  }
  var result = {
    data: compiled
  };
  return callback(null, result);
};

module.exports = RiotCompiler;