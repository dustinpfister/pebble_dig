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

    drawStack = function (layer) {

        var z = layer,
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

    },

    drawStates = {

        start : function () {},

        game : function () {}

    },

    // attach events to the current canvas
    attachEvents = function () {

        // EVENTS
        dom.addEventListener('mousedown', function (e) {
			
			var box = e.target.getBoundingClientRect(),
            cs = game.getCS();
            x = Math.floor(e.clientX - box.left),
            y = Math.floor(e.clientY - box.top);
			
			game.userAction(e.type,x,y);
            
			
/*
            var box = e.target.getBoundingClientRect(),
            cs = game.getCS();
            x = Math.floor(e.clientX - box.left),
            y = Math.floor(e.clientY - box.top),
            pxWidth = 640 / stack.w,
            pxHeight = 480 / stack.h,
            cellX = Math.floor(x / pxWidth),
            cellY = Math.floor(y / pxHeight),
            point = stack.getPoint(cellX, cellY, cs.layer),
            

            e.preventDefault();

            if (!cs.gameOver) {

                // drop down only on empty comp
                if (point.val.comp.length === 0) {

                    console.log('droping down');

                    cs.layer += 1;

                    if (cs.layer >= stack.d) {

                        cs.layer = stack.d - 1;

                    }

                } else {

                    if (cs.digs <= 0) {

                        console.log('you are out of digs!');

                    } else {

                        //console.log('time to dig');
                        console.log(point.val);

                        if (point.hp === undefined) {

                            computeComp(point);

                        }

                        if (point.hp) {

                            cs.digs -= 1;
                            point.hp -= 1;

                        }

                        if (point.hp <= 0) {

                            cs.pebbleDelta += point.val.amount;
                            point.val.comp = [];
                        }

                        if (cs.digs <= 0) {

                            cs.gameOver = true;
                            submit(stack);

                        }

                    }

                }

            } else {

                console.log('the game is over');

            }
			*/

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

        }

    };

    return api;

}
    ());
