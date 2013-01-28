$(function() {

if (!CanvasSupported()) return;

var triangle = Component.extend({
  constructor: function(el) {
    this.el = el;

    el.append('<div class="canvasContainer"><canvas class="canvas triangle"></canvas></div>');
    var canvas = el.find('canvas').css('position', 'absolute')[0];

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    $(window).resize(Component.bind(this.draw, this));
    this.draw();
  },

  el: null,
  canvas: null,
  ctx: null,

  draw: function() {
    resizeCanvas(this.el);

    var height = this.canvas.height,
        width = this.canvas.width,
        ctx = this.ctx;

    ctx.fillStyle = 'rgba(79, 72, 68, .5)';
    ctx.lineWidth = 1;

    ctx.strokeStyle = 'rgba(16, 18, 6, 1)';
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(450, height - 250);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(202, 202, 202, .3)';
    ctx.beginPath();
    ctx.arc(300, height - 150, 180, 0, Math.PI * 2, true);
    ctx.stroke();
    ctx.closePath();

    this.drawTriangle(ctx, width - 50, 290, 30);
    this.drawTriangle(ctx, width - 100, 290, 30);
    this.drawTriangle(ctx, width - 150, 290, 40);
    this.drawTriangle(ctx, width - 200, 290, 30);
  },

  drawTriangle: function(ctx, x, y, height) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 20, y - height);
    ctx.lineTo(x - 40, y);
    ctx.lineTo(x, y);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }
});

new triangle($('#blog'));
});
