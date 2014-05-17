//= require plugins.js
//= require retina.js

/* global $,WOW*/
$(function () {
  $('[data-scroll]').click(function (e) {
    e.preventDefault();

    var target = e.currentTarget,
        dest = target.getAttribute('data-scroll') == 'top' ? 'body' : target.getAttribute('href');

    $('body').animate({ scrollTop: $(dest).offset().top }, 1000, function () {
      if (dest.indexOf('#') != 0) {
        dest = '';
      }
      window.location.hash = dest;
    });
  });

  new WOW().init();

  $.stellar({ responsive: true, horizontalScrolling: false });
});
