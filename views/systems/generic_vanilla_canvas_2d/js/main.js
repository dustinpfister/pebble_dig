/*
 *    main.js
 *    Copyright 2016 by Dustin Pfister (GPL v3)
 *
 *    The main state machine and app loop for the generic_vanilla_canvas_2d client for pebble_dig
 *
 */

(function () {

    var currentState = 'start',
    firstRun = true,
    lastTick = new Date(0),
    tickRate = 1000,

    machine = {

        start : {

            firstRun : function () {

                console.log('start state: first run.');
                canvas.useCanvas('thecanvas');
				
				// just start a game here for now?
				game.newGame('fed');

            },
            tick : function () {

                console.log('start state: tick.');

            }

        },

        game : {

            firstRun : function () {

                console.log('game state: first run.');

            },
            tick : function () {

                console.log('game state: tick.');

            }

        },

    },

    loop = function () {

        var now = new Date();

        requestAnimationFrame(loop);

        if (now - lastTick >= tickRate) {

            if (firstRun) {

                machine[currentState].firstRun();
                firstRun = false;
            }

            machine[currentState].tick();
            canvas.draw(currentState);

            lastTick = new Date();

        }

    };

    loop();

}
    ());
