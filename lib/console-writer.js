'use strict';
var Stream = require('stream');

class ConsoleWriter extends Stream.Transform {
    constructor(options) {
      options = Object.assign({}, options, {
          objectMode: true
      });
      super(options);
    }

    // PSA: I'm quite sure this is a terrible implementation and breaking all the piping rules.
    // I just needed a quick and dirty for the apache formatter (which is probably also breaking the rules)
    _transform(data, enc, next) {
      console.log(data.toString(enc).replace(/\r?\n?$/, ''));
      next(null, data);
    }
}

module.exports = ConsoleWriter;
