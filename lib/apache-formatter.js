'use strict';

var Stream = require('stream');
var moment = require('moment');
var querystring = require('querystring');

var FORMAT_RE = /%(\{.*?\}|>)?[%a-zA-Z]/g
var MOMENT_FORMAT = '[[]DD/MMM/YYYY:HH:mm:ss Z[]]'
var DEFAULT = {format:'combined', separator:'\n'}
var FORMATS = {
  'combined': '%h %l %u %t \"%r\" %>s %b \"%{Referer}i\" \"%{User-agent}i\"',
  'common': '%h %l %u %t \"%r\" %>s %b',
  'referer' : '%{Referer}i -> %U'
};

class ApacheFormatter extends Stream.Transform {
    constructor(options) {
      options = Object.assign({}, options, {
          objectMode: true
      });
      super(options);
      this.formatter = formatter(options.format || 'common');
    }

    _transform(data, enc, next) {
      var line = this.formatter(data);
      next(null, line);
    }
}

module.exports = ApacheFormatter;

function formatter (format) {
  format = FORMATS[format] || format;
  return function (data) {
    var source = data.source;
    var timestamp = moment(data.timestamp)
    var replacements =
      { '%%': '%'
      , '%h': source.remoteAddress || '-'
      , '%l': '-'
      , '%u': '-'
      , '%U': data.path
      , '%t': timestamp.format(MOMENT_FORMAT)
      , '%r': mkRequestLine(data)
      , '%s': data.statusCode
      , '%>s': data.statusCode
      , '%b': responseBytes(data)
      , '%{Referer}i': data.referer || '-'
      , '%{User-agent}i': source.userAgent || '-'
    };

    function replacer (match, param) {
      return replacements[match] || match;
    }

    return format.replace(FORMAT_RE, replacer);
  };
}

// This line is faked, generated from data about the request. Worse, the HTTP version is hard-coded.
function mkRequestLine (data) {
  var method = data.method || 'get';
  var version = 'HTTP/1.1';
  var qs = querystring.stringify(data.query);
  var url = data.path + (qs ? '?' + qs : '');
  return method.toUpperCase() + ' ' + url + ' ' + version;
}

// The payload size is only known if the user sets responsePayload:true in the Good options.
function responseBytes (data) {
  var payload = data.responsePayload
  if (!payload)
    return '-'

  if (typeof payload == 'string' || Buffer.isBuffer(payload))
    return payload.length

  return JSON.stringify(payload).length
}
