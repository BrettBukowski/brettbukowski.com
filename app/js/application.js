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

  if (typeof window.matchMedia !== 'function' || window.matchMedia("(max-width: 400px)").matches) return;

  $('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', "//cdnjs.cloudflare.com/ajax/libs/animate.css/3.1.0/animate.min.css") );

  $.ajax({
    url: "//cdnjs.cloudflare.com/ajax/libs/wow/0.1.6/wow.min.js",
    dataType: 'script',
    cache: true,
    success: function () {
      new WOW().init();
    }
  });
  $.ajax({
    url: "//cdnjs.cloudflare.com/ajax/libs/stellar.js/0.6.2/jquery.stellar.min.js",
    dataType: 'script',
    cache: true,
    success: function () {
      $.stellar({ responsive: true, horizontalScrolling: false });
    }
  });
});
