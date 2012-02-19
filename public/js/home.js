jQuery(function ($) {
  $('dl').on('click', function (e) {
    if ($(this).hasClass('on')) {
      $(this)
          .removeClass('on')
    } else {
      $(this)
          .addClass('on')
    }
  });
  $('#enter').on('click', function (e) {
    var ids_arr = [],
        new_url;
    e.preventDefault();
    $('dl.on').each(function (i, elm) {
      ids_arr.push($(elm).children('input[name=_id]').val());
    });
    new_url = "/newroom?friend_id=" + ids_arr.join('+');
    window.location.href = new_url;
  });
});

