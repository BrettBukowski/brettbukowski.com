/* global Component,$,Browser */

// Loop around behavior.
$(function() {
  var Scroller = Component.extend({
    constructor: function(viewport, content) {
      this.viewport = viewport;
      this.content = content;
      this.scrollY = 0;

      $(window).scroll(Component.bind(this.onScroll, this));
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
    toTop: function() {
      this.viewport.scrollTop(5);
    },
    toBottom: function() {
      this.viewport.scrollTop(this.content.outerHeight() - 5);
    }
  });

  new Scroller($(Browser.mozilla || Browser.msie ? 'html' : 'body'), $('#content'));
});