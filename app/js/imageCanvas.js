/* global $,Component */
$(function () {
  'use strict';

  function pos(base, range, relY, offset) {
    return Math.round(base + limit(0, 1, relY - offset) * range);
  }

  function limit(min, max, value) {
    return Math.max(min, Math.min(max, value));
  }

  window.ImageCanvas = Component.extend({

    constructor: function(imagePath, selector, range, speed) {
      this.range = range;
      this.speed = speed;

      this.img = new Image();
      this.img.src = imagePath;
      this.img.onload = Component.bind(function () {
        $(selector).css('background', 'none');
        this.draw();
      }, this);

      this.canvas = $('<canvas>').appendTo(selector)[0];
      this.context = this.canvas.getContext('2d');

      this.drawing = false;
      this.lastScrollY = 0;

      window.addEventListener('scroll', Component.bind(this.onScroll, this));
      window.addEventListener('resize', Component.bind(this.draw, this));
    },

    onScroll: function () {
      if (this.drawing) return;

      this.drawing = true;
      window.requestAnimationFrame(Component.bind(this.drawCanvas, this));
      this.lastScrollY = window.scrollY;
    },

    resize: function () {
      this.canvas.width = window.innerWidth;
      this.canvas.height = parseInt(window.getComputedStyle(this.canvas).height, 10);
    },

    draw: function () {
      this.resize();
      this.drawCanvas();
    },

    drawCanvas: function () {
      var relativeY = this.lastScrollY / this.speed;

      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.drawImage(this.img,
        0, 0,
        this.img.naturalWidth, this.img.naturalHeight,
        0, pos(0, this.range, relativeY, 0),
        this.canvas.width, this.canvas.height
      );

      this.drawing = false;
    }
  });
});
