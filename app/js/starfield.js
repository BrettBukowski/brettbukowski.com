$(function() {
var StarField = Component.extend({
  constructor: function(toAppend) {
    if (!this.canvasSupported()) return;

    toAppend.append('<div class="starFieldContainer"><canvas class="starField"></canvas></div>');
    this.draw();
    $(window).resize(this.draw);
  },

  draw: function() {
    var numberOfStars = $(window).outerWidth() / 9;

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
  },

  canvasSupported: function() {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
  }
});

new StarField($('#hi,#contact'));

});