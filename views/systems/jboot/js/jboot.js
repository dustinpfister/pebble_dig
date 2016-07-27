/*
 *    iboot.js
 *    Copyright 2016 by Dustin Pfister (GPL v3)
 *
 *    some javascript for jboot client system for pebble_dig
 *
 */

(function () {

    // resize
    var onResize = function () {

        var canWidth = $('#thecanvas').width(),
        winWidth = window.innerWidth,
        winHeight = window.innerHeight;

        if (winWidth > winHeight) {

            canvas.resize(
                winHeight,
                winHeight-65);

        } else {

            canvas.resize(
                winWidth,
                winWidth-65);

        }
        $('#thecanvas').css('left', '0px');

        // new canvas width
        canWidth = $('#thecanvas').width();

        // center
        $('#thecanvas').css('left', Math.floor( (winWidth - canWidth) / 2 ) + 'px');

    };

    // call and attach resize
    onResize();
    $(window).on('resize', onResize);

    // navbar
    $('.nav-option').on('click', function (e) {

        var option = e.target.innerHTML;

        if (option === 'Dig Fed') {

            api.newGame('fed');
            machine.changeState('game');

        }

        if (option === 'Dig User') {

            api.newGame('pvp');
            machine.changeState('game');

        }

        console.log(e.target.innerHTML);

        $('#nav-button').click();

    });

}
    ());
