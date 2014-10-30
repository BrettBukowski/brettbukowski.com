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

    constructor: function(imagePath, selector, range, speed, direction) {
      this.direction = direction;
      this.range = range;
      this.speed = speed;

      this.img = new Image();
      this.img.src = imagePath;
      this.img.className = 'parallax';
      this.img.alt = '';
      this.img.onload = Component.bind(function () {
        $(selector).css('background', 'none').append(this.img);
      }, this);

      this.drawing = false;
      this.lastScrollY = 0;

      window.addEventListener('scroll', Component.bind(this.onScroll, this));
    },

    onScroll: function () {
      if (this.drawing) return;

      this.drawing = true;
      window.requestAnimationFrame(Component.bind(this.reposition, this));
      this.lastScrollY = window.scrollY;
    },

    reposition: function () {
      var relativeY = this.lastScrollY / this.speed;
      var newPosition = pos(0, this.range, relativeY, 0);
      if (this.direction == 'down') {
        newPosition = Math.abs(newPosition);
      }
      this.applyTransform(newPosition);
      this.drawing = false;
    },

    applyTransform: function (y) {
      var props = ['transform', 'webkitTransform', 'mozTransform', 'msTransform'];
      for (var i = 0, prop; i < props.length; i++) {
        prop = props[i];
        if (prop in this.img.style) {
          this.img.style[prop] = "translate3d(0, " + y + "px, 0)";
          return;
        }
      }
    }
  });
});
