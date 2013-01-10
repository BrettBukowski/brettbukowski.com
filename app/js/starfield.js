$(function() {

if (!CanvasSupported()) return;

var StarField = Component.extend({
  constructor: function(toAppend) {
    this.el = toAppend;
    toAppend.append('<div class="canvasContainer"><canvas class="canvas starField"></canvas></div>');
    this.draw();
    $(window).resize(Component.bind(this.draw, this));
  },

  draw: function() {
    resizeCanvas(this.el);

    var numberOfStars = $(window).outerWidth() / 6;

    $('canvas.starField').each(function() {
      for (var i = 0, canvas = $(this)[0], width = canvas.width, height = canvas.height, ctx = canvas.getContext('2d'), angle = Math.PI * 2; i < numberOfStars; i++) {
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
  }
});

new StarField($('#hi,#contact'));

});