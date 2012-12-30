$(function () {
var retinaSwapper = Component.extend({
  constructor: function(toSwap) {
    this.toSwap = toSwap;
  },
  toSwap: null,
  swap: function() {
    if (this.toSwap && retinaSwapper.isRetina()) {
      this.toSwap.each(function(index) {
        var src = $(this).attr('src'),
            path = src.split('.');
        path[0] += "@2x";
        $(this).attr('src', path.join('.'));
      });
    }
  }
}, {
  isRetina: function() {
    return window.devicePixelRatio > 1 || (window.matchMedia && window.matchMedia(retinaSwapper.mediaQuery).matches);
  },
  // From <https://github.com/imulus/retinajs/blob/master/src/retina.js>
  mediaQuery: "(-webkit-min-device-pixel-ratio: 1.5),\
                (min--moz-device-pixel-ratio: 1.5),\
                (-o-min-device-pixel-ratio: 3/2),\
                (min-resolution: 1.5dppx)"
});

new retinaSwapper($('#projects img')).swap();

});