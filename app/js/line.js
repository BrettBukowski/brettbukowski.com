/* global Component,$,CanvasSupported,resizeCanvas */
// Drawing on bio panel.
$(function() {

  if (!CanvasSupported()) return;

  var Line = Component.extend({
    constructor: function(el) {
      this.el = el;

      el.append('<div class="canvasContainer"><canvas class="canvas lines"></canvas></div>');
      var canvas = el.find('canvas')[0];

      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');

      this.draw();
      $(window).resize(Component.bind(this.draw, this));
    },

    el: null,
    canvas: null,
    ctx: null,

    draw: function() {
      resizeCanvas(this.el);

      var height = this.canvas.height,
          width = this.canvas.width,
          ctx = this.ctx;

      ctx.strokeStyle = 'rgba(202, 202, 202, .9)';
      ctx.lineWidth = 0.1;

      for (var count = 0,
              startY = 0 + 200,
              endX = 200,
              cpx = 140,
              cpy = startY + 100;
          count < 10; count++) {

        ctx.beginPath();
        ctx.moveTo(0, startY);
        ctx.bezierCurveTo(cpx, cpy, cpx, cpy, endX, 0);
        ctx.stroke();

        endX += 10;
        startY -= 10;
        cpx += 10;
        cpy += 10;
      }
      ctx.lineWidth = 0.1;
      ctx.strokeStyle = 'rgba(255, 255, 255, .9)';
      for (count = 0,
            startY = height - 100,
            endX = width - 360,
            cpx = width - 200,
            cpy = startY - 300;
          count < 30; count++) {

        ctx.beginPath();
        ctx.moveTo(width, startY);
        ctx.bezierCurveTo(cpx, cpy, cpx, cpy, endX, height);
        ctx.stroke();

        endX -= 10;
        startY -= 10;
        cpx -= 10;
        cpy -= 10;
      }
    }
  });

  new Line($('#bio'));
});