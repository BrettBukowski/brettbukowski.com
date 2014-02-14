/* global Component,$,CanvasSupported,resizeCanvas */
// Generate stars on two of the panels.
$(function() {

  if (!CanvasSupported()) return;

  var StarField = Component.extend({
    sizeWhenDrawn: 0,

    constructor: function(toAppend) {
      this.el = toAppend;
      toAppend.append('<div class="canvasContainer"><canvas class="canvas starField"></canvas></div>');
      resizeCanvas(this.el);
      $(window).resize(Component.bind(this.draw, this));
    },

    draw: function() {
      var numberOfStars = parseInt($(window).outerWidth() / 20, 10);

      if (numberOfStars < this.sizeWhenDrawn) return;

      if (numberOfStars != this.sizeWhenDrawn) {
        resizeCanvas(this.el);
      }

      this.el.find('canvas.starField').each(function() {
        for (var i = 0,
                 canvas = $(this)[0],
                 width = canvas.width,
                 height = canvas.height,
                 ctx = canvas.getContext('2d'),
                 angle = Math.PI * 2;
                  i < numberOfStars; i++) {
          ctx.beginPath();
          ctx.arc(
            Math.random() * width,  // x
            Math.random() * height, // y
            Math.random() * 2,      // radius
            0,                      // start angle
            angle,                  // end angle
            true                    // clockwise
          );
          ctx.fillStyle = "rgba(255, 255, 255, " + Math.random() + ")";
          ctx.fill();
        }
      });

      this.sizeWhenDrawn = numberOfStars;
    }
  });

  new StarField($('#hi,#contact'));

});