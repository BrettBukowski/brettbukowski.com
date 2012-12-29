!function() {

var Panel = Component.extend({
  element: null,

  constructor: function(element) {
    this.element = element;

    $(window)
      .resize(Component.bind(this.setDimensions, this))
      .trigger('resize');
  },

  setDimensions: function() {
    var newHeight = $(window).height() + 10;
    this.element.css('minHeight', newHeight);
    var top = this.element.offset().top;
                this.element.attr('data-top', top)
                .attr('data-bottom', top + this.element.height());
  }
});

var Controller = Component.extend({
  // Contains ea. Panel section
  collection: [],

  // Element to monitor the scroll position of
  monitor: null,

  // Current scroll position
  scrollY: 0,

  // Index of the current panel
  currentPanel: -1,

  // Key codes for relevant keyboard events
  keyCodes: {
    home:  36,
    end:   35,
    left:  37,
    up:    38,
    right: 39,
    down:  40
  },

  // Starts listening to all the events
  constructor: function() {
    this.monitor = $(window);

    this.monitor
      .scroll(Component.bind(this._updateScrollLocation, this))
      .trigger('scroll');

    this.monitor.bind('popstate', Component.bind(this.goToHash, this));

    window.setInterval(Component.bind(this._updateHash, this), 100);

    this._bindKeyboardEvents();
  },

  // Adds a routing handler the the keydown event
  _bindKeyboardEvents: function() {
    $(document).on('keydown', Component.bind(function(e) {
      var tag = e.target.tagName.toLowerCase(),
          keyCode = e.keyCode,
          keyCodes = this.keyCodes,
          direction;

      if (tag === 'input' || tag === 'textarea') return;

      if (keyCode === keyCodes.up || keyCode === keyCodes.left) {
        direction = 'prev';
      }
      else if (keyCode === keyCodes.down || keyCode === keyCodes.right) {
        direction = 'next';
      }
      else if (keyCode === keyCodes.home) {
        direction = 'first';
      }
      else if (keyCode === keyCodes.end) {
        direction = 'last';
      }

      if (direction) {
        e.preventDefault();
        this.goToPanel(direction);
      }
    }, this));
  },

  // onscroll callback to update the scroll position
  _updateScrollLocation: function() {
    this.scrollY = this.monitor.scrollTop();
  },

  // Checks if the current page should update the location hash
  // and does so if it should
  _updateHash: function() {
    var y = this.scrollY;

    this._somePanels(function(panel, i) {
      if (i !== this.currentPanel &&
          y >= parseInt(panel.attr('data-top'), 10) &&
          y < parseInt(panel.attr('data-bottom'), 10)) {
        this.currentPanel = i;
        this._setHash(panel.attr('id'), panel.attr('data-title') || '');

        return true;
      }
    });
  },

  // Sets the hash
  _setHash: function(hash, title) {
    hash = '#' + hash;
    if (window.history.pushState && window.location.hash !== hash) {
      // Only use history API to update the hash, because
      // using window.location.hash affects the scroll position
      // as the window snaps to the anchor location as soon
      // as the hash is changed
      window.history.pushState(hash, title, hash);
    }
  },

  // Iterates thru ea. panel, passing it into the callback.
  // If the callback returns a truthy value then the loop exits
  // and the function returns the callback's return value.
  _somePanels: function(callback) {
    for (var returnVal, i = 0, collection = this.collection, len = collection.length; i < len; i++) {
      returnVal = callback.call(this, collection[i].element, i);
      if (returnVal) return returnVal;
    }
  },

  // Adds a Panel instance to the collection
  addPanel: function(panel) {
    this.collection.push(panel);
  },

  // Event handler for popstate event.
  // Scrolls to the panel specified by the
  // hash
  goToHash: function(e) {
    e.preventDefault();

    var hash = e.originalEvent.state,
        yPosition = 0;

    if (!hash) return;

    if (hash) {
      hash = hash.substr(1);
      this._somePanels(function(panel) {
        if (panel.attr('id') === hash) {
          return yPosition = panel.attr('data-top');
        }
      })
    }
    this._scrollToPosition(yPosition);
  },

  // Scrolls to the given y coordinate
  _scrollToPosition: function(yPosition) {
    if (parseInt(yPosition, 10) === 0) yPosition = 5;

    $('body').animate({
      scrollTop: yPosition
    }, 800);
  },

  // Scrolls to the panel specified by the direction:
  // first, last, next, prev
  goToPanel: function(which) {
    var elementIndex = null;

    if (which === 'first') {
      elementIndex = 0;
    }
    else if (which === 'last') {
      elementIndex = this.collection.length - 1;
    }
    else if (which === 'next') {
      elementIndex = this.currentPanel + 1;
    }
    else if (which === 'prev') {
      elementIndex = this.currentPanel - 1;
    }

    if (elementIndex !== null) {
      // Loop around to top / bottom
      if (elementIndex === this.collection.length) {
        $('body').scrollTop(5);
        return;
      }
      if (elementIndex < 0) {
        $('body').scrollTop($('body').outerHeight() - 5);
        return;
      }

      this._scrollToPosition(this.collection[elementIndex].element.attr('data-top'));
    }
  }
});

var panelController = new Controller();

$('#content > section').each(function() {
  panelController.addPanel(new Panel($(this)));
});

}();