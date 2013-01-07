$(function() {
  $('#cover').remove();

  $('#projects li').on('click', 'img', function(e) {
    e.preventDefault();
    $(e.target).next('.details').find('a')[0].click();
  });
});

