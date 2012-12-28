$(function() {
$('#cover').remove();

var Scroller = Component.extend({
  constructor: function(viewport, content) {
    this.viewport = viewport;
    this.content = content;
    this.scrollY = 0;

    $(window).scroll(Component.bind(this.onScroll, this));
    // $(window).resize(this.onResize).trigger('resize');
  },
  onScroll: function() {
    var delta = this.viewport.scrollTop() - this.scrollY,
        y = this.scrollY = this.viewport.scrollTop();

    if (Math.abs(delta) < 1000) {
      if (y < 5 && delta < 0) {
        this.toBottom();
      }
      else if (y > this.content.outerHeight() - $(window).height() - 5 && delta > 0) {
        this.toTop();
      }
    }
  },
  onResize: function() {

  },
  toTop: function() {
    this.viewport.scrollTop(5);
  },
  toBottom: function() {
    this.viewport.scrollTop(this.content.outerHeight() - 5);
  }
});

// new Scroller($($.browser.mozilla || $.browser.msie ? 'html' : 'body'), $('#content'));


var Speckle = Component.extend({
  constructor: function(parent) {
    parent.append($(Speckle.templ).css({
      top: Math.random() * 100 + '%',
      left: Math.random() * 100 + '%',
      height: Math.random() * Speckle.bounds + 'px',
      width: Math.random() * Speckle.bounds + 'px',
      borderRadius: Math.random() * Speckle.bounds + 'px'
    }).addClass(Math.round(Math.random() * 4) == 4 ? 'twinkle' : ''));
  }
}, {
  templ: '<span class="speckle"></span>',
  bounds: 3
});

for (var i = 0, parent = $('#hi,#contact'); i < 400; i++) {
  new Speckle(parent);
}

var bgScroller = Component.extend({
  view: null,
  viewport: null,
  scrollSpeed: 10,

  constructor: function(viewport, view) {
    this.viewport = viewport;
    this.view = view;

    $(window).scroll(Component.bind(this.onScroll, this));
  },
  onScroll: function() {
    var top = this.viewport.scrollTop();

    this.view.css('backgroundPosition', (top * 2) + 'px -' + (top * this.scrollSpeed) + 'px');
  }
});
// new bgScroller($($.browser.mozilla || $.browser.msie ? 'html' : 'body'), $('#hi,#contact'));


var retinaSwapper = Component.extend({
  constructor: function(toSwap) {
    this.toSwap = toSwap;
  },
  toSwap: null,
  swap: function() {
    if (this.toSwap && retinaSwapper.isRetina()) {
      this.toSwap.each(function(index) {
        var src = $(this).attr('src'),
            path = src.split('.');
        path[0] += "@2x";
        $(this).attr('src', path.join('.'));
      });
    }
  }
}, {
  isRetina: function() {
    return window.devicePixelRatio > 1 || (window.matchMedia && window.matchMedia(retinaSwapper.mediaQuery).matches);
  },
  // From <https://github.com/imulus/retinajs/blob/master/src/retina.js>
  mediaQuery: "(-webkit-min-device-pixel-ratio: 1.5),\
                (min--moz-device-pixel-ratio: 1.5),\
                (-o-min-device-pixel-ratio: 3/2),\
                (min-resolution: 1.5dppx)"
});

new retinaSwapper($('#projects img')).swap();

$('#content').curtain();

var FormDealer = Component.extend({
  submitButton: null,
  form: null,
  constructor: function() {
    $(document).delegate('form', 'submit', Component.bind(this.onSubmit, this));
  },
  onSubmit: function(e) {
      this.form = $(e.target);

      e.preventDefault();

      this.submitButton = this.form.find('input[type="submit"]');
      this.submitButton
        .val('Sending...')
        .prop('disabled', true);

      this.submitForm(this.form);
  },
  submitForm: function(form) {
    $.ajax(form.attr('action'), {
      data: form.serializeArray(),
      type: form.attr('method') || 'POST',
      dataType: 'json',
      context: this
    })
      .done(this.onSuccess)
      .fail(this.onFail);
  },
  onSuccess: function(response, status, xhr) {
    if (response.sent) {
      this.form.animate({ height: 0 }, 'slow', 'linear', function() {
        $('#formMessage').html("Thanks for getting in touch! I'll respond to you presently.").removeClass('hidden');
        $(this).remove();
      });
    }
    else {
      this.onFail();
    }
  },
  onFail: function(xhr, status, error) {
      $('#formMessage').html('There was a problem. Check the form and please try again.').removeClass('hidden');
      this.submitButton.val('Send').prop('disabled', false);
  }
});
new FormDealer();

});
