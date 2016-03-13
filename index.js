var compile = require('riot').compile;
var progeny = require('progeny');

RiotCompiler = function(config) {
  this.config = (config && config.plugins && config.plugins.riot) || {};
  this.rootPath = config.paths.root;

  // grab any compiler options
  this.compiler_options = {};
  if (this.config.template) {
    this.compiler_options.template = this.config.template;
  }
  this.compiler_options.type = this.config.type;

  // We prefer, in this order, an explicit pattern, an explicit
  // extention, or a default extension
  if (this.config.pattern) {
    this.pattern = this.config.pattern;
  } else if (this.config.extension) {
    this.extension = this.config.extension;
  } else {
    this.pattern = /\.tag$/;
  }
}

RiotCompiler.prototype.brunchPlugin = true;
RiotCompiler.prototype.type = 'javascript';

RiotCompiler.prototype.compile = function(data, path, callback) {
  var compiled;
  try {
    compiled = compile(data, this.compiler_options, path);
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

RiotCompiler.prototype.getDependencies = function(sourceContents, file, callback) {
  progeny({rootPath: this.rootPath})(file, sourceContents, callback);
}

module.exports = RiotCompiler;