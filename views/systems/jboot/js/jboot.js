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

        var w = window.innerWidth,
        h = window.innerHeight - 55,
        l = 0;

        if (w > h) {

            l = Math.floor((w - h) / 2);
            w = h;

        } else {

            h = w;

        }

        canvas.resize(w, h);
        $('#thecanvas').css('left', l + 'px');

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
