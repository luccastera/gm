
// gm - Copyright Aaron Heckmann <aaron.heckmann+github@gmail.com> (MIT Licensed)

var fs = require('fs');

module.exports = function (proto) {

function noop () {}

// http://www.graphicsmagick.org/GraphicsMagick.html#details-morph
proto.morph = function morph (other, outname, callback) {
  if (!callback) callback = noop;

  if (!outname) {
    throw new Error("an output filename is required");
  }

  var self = this;

  self.out(other, "-morph", 1);

  self.write(outname, function (err, stdout, stderr, cmd) {
    if (err) {
      return callback.call(self, err, stdout, stderr, cmd);
    }

    var remaining = 3;

    fs.unlink(outname + ".0", next);
    fs.unlink(outname + ".2", next);
    fs.rename(outname + ".1", outname, next);

    function next (err) {
      if (next.err) return;

      if (err) {
        next.err = err;
        return callback.call(self, err, stdout, stderr, cmd);
      }

      if (--remaining) return;

      callback.call(self, err, stdout, stderr, cmd);
    }
  });

  return self;
}}