$(function() {
  function supplyTooltips () {
    $('[title]').each(function() {
      var el = $(this);
      el.after('<div class="what">?</div><div class="tooltip" style="display:none">' + el.attr('title') + '</div>');
      el.removeAttr('title');
    });
    function fadeToggle () {
      $(this).next().fadeToggle();
    };
    $('.what').hover(fadeToggle, fadeToggle);
  }
  supplyTooltips();
});
