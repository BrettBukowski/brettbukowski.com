$(function() {

if (!CanvasSupported()) return;

var StarField = Component.extend({
  constructor: function(toAppend) {
    toAppend.append('<div class="canvasContainer"><canvas class="canvas"></canvas></div>');
    this.draw();
    $(window).resize(this.draw);
  },

  draw: function() {
    var numberOfStars = $(window).outerWidth() / 6;

    $('canvas').each(function(index) {
      var canvas = $(this),
          parent = canvas.parent(),
          width = parent.outerWidth(),
          height = parent.outerHeight();

      canvas.attr('width', width)
            .attr('height', height)

      for (var i = 0, ctx = canvas[0].getContext('2d'), angle = Math.PI * 2; i < numberOfStars; i++) {
        ctx.beginPath();
        ctx.arc(
          Math.random() * width,  // x
          Math.random() * height, // y
          Math.random() * 2,      // radius
          0,                      // start angle
          angle,                  // end angle
          true                    // clockwise
        );
        // ctx.closePath();
        ctx.fillStyle = "rgba(255, 255, 255, " + Math.random() + ")";
        ctx.fill();
      }
    });
  }
});

new StarField($('#hi,#contact'));

});