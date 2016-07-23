/*
 *    canvas.js
 *    Copyright 2016 by Dustin Pfister (GPL v3)
 *
 *    responcabule for canvas rendering and event attachment for the generic_vanilla_canvas_2d client for pebble_dig
 *
 */

var canvas = (function () {

    var dom,
    ctx,

    drawInfo = function () {

        var cs = game.getCS(),
        dom = document.getElementById('game_info_area'),

        html = '';

        if (cs.username) {

            html = '{ user: ' + cs.username +
                ', pebble : ' + cs.wallet + '}<br>' +
                'attacking user: ' + cs.attackingUsername + '; currentLayer :' +
                cs.layer + '; digs : ' + cs.digs + '; pebble in land: ' + cs.pebbleInLand + '; pebbleDelta: ' + cs.pebbleDelta;

        }

        dom.innerHTML = html;
    },

    drawStack = function () {

        var z = game.getCS().layer,
        zLen = stack.d,
        x,
        y,
        xLen = stack.w,
        yLen = stack.h,
        pxWidth = 640 / xLen,
        pxHeight = 480 / yLen,
        ci,
        ciLen,
        point;

        y = 0;

        if (stack.points.length > 0) {
            while (y < yLen) {

                x = 0;
                while (x < xLen) {

                    point = stack.getPoint(x, y, z);

                    /*

                    ALERT! we will have to do soething like this in the future

                    ci = 0, ciLen = point.val.comp.length;
                    while(ci < ciLen){



                    ci += 1;
                    }
                     */

                    if (point.val.comp.length > 0) {

                        // just render based on comp[0] for now
                        if (point.val.comp[0].id === 0) {

                            // if dirt
                            ctx.fillStyle = 'rgba(255,255,0,1)';

                        } else {

                            // else rock
                            ctx.fillStyle = 'rgba(128,128,128,1)';

                        }

                    } else {

                        ctx.fillStyle = '#000000';

                    }

                    ctx.fillRect(x * pxWidth, y * pxHeight, pxWidth, pxHeight);

                    x += 1;

                }

                y += 1;

            }

        }

    },

    drawStates = {

        start : function () {},

        title : function () {

            drawInfo();
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.font = '50px courier';
            ctx.fillText('pebble dig!', 320, 220);

            ctx.font = '25px courier';
            ctx.fillText('solo game', 160, 350);
            ctx.fillText('pvp game', 480, 350);

        },

        game : function () {

            drawInfo();
            drawStack();

        },

        gameOver : function () {

            drawInfo();

            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            ctx.font = '100px courier';
            ctx.fillText('GAME OVER', 320, 220);


        }

    },

    // attach events to the current canvas
    attachEvents = function () {

        // EVENTS
        dom.addEventListener('mousedown', function (e) {

            var box = e.target.getBoundingClientRect(),
            x = Math.floor(e.clientX - box.left),
            y = Math.floor(e.clientY - box.top),
            cellWidth = 640 / stack.w,
            cellHeight = 480 / stack.h;

            e.preventDefault();

            game.userAction({
                e : e,
                type : e.type,
                x : x,
                y : y,
                cellWidth : cellWidth,
                cellHeight : cellHeight,
                cellX : Math.floor(x / cellWidth),
                cellY : Math.floor(y / cellHeight),

            });

        });

    },

    api = {

        // use the given hard coded canvas element
        useCanvas : function (canvasId) {

            dom = document.getElementById(canvasId);
            ctx = dom.getContext('2d');

            dom.width = 640;
            dom.height = 480;

            attachEvents();

        },

        draw : function (state) {

            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, dom.width, dom.height);

            drawStates[state]();

        }

    };

    return api;

}
    ());
