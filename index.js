'use strict';
const compile = require('riot').compile;
const progeny = require('progeny');

class RiotCompiler {
  constructor(config) {
    this.config = config.plugins.riot || {};
    this.rootPath = config.paths.root;
    this.requireRiot = this.config.requireRiot;

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
      this.getDependencies = file => {
        return new Promise((resolve, reject) => {
          progeny({
            rootPath: this.rootPath,
          })(file.path, file.data, (err, res) => {
            if (err) {
              reject(err);
            } else {
              resolve(res);
            }
          });
        });
      };
    }
  }

  compile(file) {
    try {
      let result = compile(file.data, this.compiler_options, file.path);
      if (this.requireRiot) {
          result = "var riot = require('riot');\n\n" + result;
      }
      return result;
    } catch (err) {
      const loc = err.location;
      if (loc) {
        throw `${loc.first_line}:${loc.first_column} ${err}`;
      }
      throw `${err}`;
    }
  }
}

RiotCompiler.prototype.brunchPlugin = true;
RiotCompiler.prototype.type = 'javascript';

module.exports = RiotCompiler;
