var compile = require('riot').compile;

RiotCompiler = function(config) {
  if (config == null) config = {};
  var plugin = config.plugins && config.plugins.riot
  var conv = config.conventions && config.conventions.vendor
}

RiotCompiler.prototype.brunchPlugin = true;
RiotCompiler.prototype.type = 'javascript';
RiotCompiler.prototype.extension = 'tag';
RiotCompiler.prototype.pattern = /\.tag/;

RiotCompiler.prototype.compile = function(data, path, callback) {
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

module.exports = RiotCompiler