jQuery(document).ready(function ($) {
    $('.sandwich').on('click', function () {
        var $this = $(this);
        $('.sandwich__icon-bar').hide();
        $('.popup-menu').fadeToggle(300);


        var popupMenu = $('.popup-state');

        if (popupMenu.hasClass('icon-active')) {
            popupMenu.removeClass('icon-active');
            $('.sandwich__icon-bar').show();

        } else {
            popupMenu.addClass('icon-active');
        }
    });

});



