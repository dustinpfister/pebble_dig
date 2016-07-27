/*
 *    main.js
 *    Copyright 2016 by Dustin Pfister (GPL v3)
 *
 *    The main state machine and app loop for the generic_vanilla_canvas_2d client for pebble_dig
 *
 */

var machine = (function () {

    var currentState = 'start',
    firstRun = true,
    lastTick = new Date(0),
    tickRate = 33,

    machine = {

        start : {

            firstRun : function () {

                console.log('start state: first run.');
                canvas.useCanvas('thecanvas');

                // just start a game here for now?
                //game.newGame('fed');

            },
            tick : function () {

                console.log('start state: tick.');

                currentState = 'title';
                firstRun = true;

            }

        },

        title : {

            firstRun : function () {},

            tick : function () {}

        },

        game : {

            firstRun : function () {
				
				canvas.clear();
				
			},
            tick : function () {}

        },

        gameOver : {

            firstRun : function () {},
            tick : function () {}

        }

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

    return {

        getState : function () {

            return currentState;

        },

        changeState : function (state) {

            currentState = state;
            firstRun = true;

        }

    };

}
    ());
