/* global $ */
// Canvas normalization for the rest of the
// components on the page.
// From <https://gist.github.com/1579671>
(function() {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                               || window[vendors[x]+'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame)
    window.requestAnimationFrame = function(callback) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };

  if (!window.cancelAnimationFrame)
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
}());

$(function() {
  window.resizeCanvas = function(parent) {
    parent.find('.canvasContainer canvas').each(function() {
      var canvas = $(this),
          parent = canvas.parent(),
          width = parent.outerWidth(),
          height = parent.outerHeight();

      canvas.attr('width', width)
            .attr('height', height);
    });
  };
});
