'use strict';
var compile = require('riot').compile;
var progeny = require('progeny');

class RiotCompiler {
  constructor(config) {
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

    // Don't try checking for dependencies unless the tag
    // pre-processor supports it, since progeny may fail
    // on types it doesn't support.
    if (this.compiler_options.type == 'jade') {
      this.getDependencies = function (data, path) {
        var rootPath = this.rootPath;
        return new Promise(function (resolve, reject) {
          progeny({
            rootPath: rootPath
          })(path, data, function (e, res) {
            if (e) {
              reject(e);
            } else {
              resolve(res);
            }
          });
        });
      };
    }
  }

  compile(file) {
    var compiled;
    try {
      compiled = "var riot = require('riot');\nmodule.exports = " + compile(file.data, this.compiler_options, file.path);
    } catch (err) {
      var loc = err.location,
        error;
      if (loc) {
        error = loc.first_line + ":" + loc.first_column + " " + (err.toString());
      } else {
        error = err.toString();
      }
      return Promise.reject(error);
    }
    var result = {
      data: compiled
    };
    return Promise.resolve(result);
  }
}

RiotCompiler.prototype.brunchPlugin = true;
RiotCompiler.prototype.type = 'javascript';

module.exports = RiotCompiler;
