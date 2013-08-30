// Panel behavior.
$(function() {

var Panel = Component.extend({
  element: null,
  height: 0,

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
    this.height = this.element.height();
    this.element.attr('data-top', Math.ceil(top))
                .attr('data-bottom', Math.ceil(top + this.height));
  },

  nowCurrent: function() {},

  notCurrent: function() {}
});

var TopPanel = Panel.extend({
  scrollY: 0,

  lastDrawPos: 0,

  canvas: null,

  context: null,

  monitor: $('body'),

  animationID: null,

  constructor: function(element) {
    this.constructor.__super__.constructor.call(this, element);

    if (Browser.ios || Browser.android) {
      // Don't do the fancy animation / image on low powered devices.
      this.nowCurrent = this.notCurrent = function () {};
      return;
    }

    this.loadBackground();

    if (!CanvasSupported()) return;

    element.append('<div class="canvasContainer spireCanvas"><canvas class="canvas"></canvas></div>');
    resizeCanvas(element);
    this.canvas = element.find('.spireCanvas canvas')[0];
    this.context = this.canvas.getContext('2d');
    this.draw();
  },

  nowCurrent: function() {
    $(window).bind('scroll.topPanel', Component.bind(this._updatePosition, this));
    this._updatePosition();
    this._animate();
  },

  notCurrent: function() {
    $(window).unbind('scroll.topPanel');
    cancelAnimationFrame(this.animationID);
  },

  _updatePosition: function() {
    this.scrollY = this.monitor.scrollTop();
  },

  _animate: function() {
    this.animationID = requestAnimationFrame(Component.bind(this._animate, this));
    this.draw();
  },

coords: [
      {
        start: [125, 90],
        points: [
          50,
          80,
          120,
          190
        ]
      },
      {
        start: [510, 220],
        points: [
          350,
          400,
          510,
          550
        ]
      },
      {
        start: [590, 120],
        points: [
          560,
          590,
          610
        ]
      },
      {
        start: [770, 170],
        points: [
          680,
          700,
          790
        ]
      },
      {
        start: [930, 90],
        points: [
          820,
          950,
          1000
        ]
      },
      {
        start: [1150, 140],
        points: [
          1100,
          1154,
          1200
        ]
      },
      {
        start: [1250, 350],
        points: [
          1204,
          1270
        ]
      },
      {
        start: [ 1400,370 ],
        points: [
          1280,
          1300,
          1400,
          1450
        ]
      },
      {
        start: [ 1550,420 ],
        points: [
          1500,
          1560,
          1580
        ]
      },
      {
        start: [ 1600,400 ],
        points: [
          1580,
          1640
        ]
      },
      {
        start: [ 1650,420 ],
        points: [
          1640
        ]
      },
      {
        start: [ 1700,410 ],
        points: []
      }
    ],

  updateCanvas: function () {
    var scrollY = this.scrollY,
        height = this.canvas.height;

    if (scrollY > 300) {
      $('.spireCanvas canvas').css({
        position: 'absolute',
        top: '300px'
      });
    }
    else {
      $('.spireCanvas canvas').css({
        position: 'fixed',
        top: '0'
      });
    }
  },

  draw: function() {
    var ctx = this.context,
        canvas = this.canvas,
        coords = this.coords.slice(),
        width = canvas.width,
        height = canvas.height,
        scrollY = this.scrollY;

    if (scrollY == this.lastDrawPos || scrollY >= height || scrollY < 0) return;

    ctx.clearRect(0, 0, width, height);
    this.updateCanvas();

    ctx.moveTo(0, 80);
    while (coords.length) {
      var coord = coords.shift();
      var start = coord.start;
      var points = coord.points.slice();

      ctx.strokeStyle = 'rgba(255, 255, 255, .3)';
      ctx.lineTo(start[0], start[1]);
      ctx.stroke();

      ctx.beginPath();

      var delta = Math.min(10, scrollY - this.lastDrawPos);

      while (points.length) {
        var point = points.shift();
        ctx.moveTo(start[0], start[1]);
        if (point > start[0]) {
          point -= ((scrollY / height) * ( (point - start[0]) ));
        }
        else {
          point += ((scrollY / height) * ( (start[0] - point) ));
        }
        ctx.lineTo(point, -1);
      }

      ctx.lineWidth = '1';
      ctx.strokeStyle = 'rgba(255, 255, 255, .1)';
      ctx.stroke();
      ctx.moveTo(start[0], start[1]);
    }

    this.lastDrawPos = this.scrollY;
  },

  loadBackground: function() {
    var img = new Image(),
        src = '/img/mountainflip.png',
        loadBg = function () {
          $('#hi,#contact').append('<img src="' + src + '" alt="">');
          $('#hi img').animate({
            top: '-450px'
          }, 100, function () {
            $(this).animate({
              top: '-488px'
            }, 300);
          });
        },
        start = +new Date();

    img.addEventListener('load', function () {
      if ((+new Date()) - start < 1000) {
        setTimeout(loadBg, 1000);
      }
      else {
        loadBg();
      }
    });
    img.src = src;
  },
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

  originalDocumentTitle: document.title,

  // Starts listening to all the events
  constructor: function() {
    this.monitor = $(window);

    this.monitor
      .scroll(Component.bind(this._updateScrollLocation, this))
      .bind('popstate', Component.bind(this.goToHash, this))
      .trigger('scroll');


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
    var y = this.scrollY,
        prevPanelChanged = false;

    this._somePanels(function(panel, i) {
      if (i !== this.currentPanel &&
          y >= parseInt(panel.element.attr('data-top'), 10) &&
          y < parseInt(panel.element.attr('data-bottom'), 10)) {
        prevPanelChanged = this.currentPanel;

        this.currentPanel = i;
        panel.nowCurrent();
        this._setHash(panel.element.attr('id'), panel.element.attr('data-title') || '');

        return true;
      }
    });

    if (prevPanelChanged !== false) {
      var prev = this.collection[prevPanelChanged];
      if (prev) {
        prev.notCurrent();
      }
    }
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
      document.title = this.originalDocumentTitle + ' / ' + title;
    }
  },

  // Iterates thru ea. panel, passing it into the callback.
  // If the callback returns a truthy value then the loop exits
  // and the function returns the callback's return value.
  _somePanels: function(callback) {
    for (var returnVal, i = 0, collection = this.collection, len = collection.length; i < len; i++) {
      returnVal = callback.call(this, collection[i], i);
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
          return yPosition = panel.element.attr('data-top');
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
  // -first, last, next, prev
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

panelController.addPanel(new TopPanel($('#hi')));

$('#bio,#projects,#blog,#contact').each(function() {
  panelController.addPanel(new Panel($(this)));
});

});