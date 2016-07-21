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

    drawStates = {

        start : function () {},

        game : function () {}

    },

    api = {

        // use the given hard coded canvas element
        useCanvas : function (canvasId) {

            dom = document.getElementById(canvasId);
            ctx = dom.getContext('2d');

            dom.width = 640;
            dom.height = 480;

        },

        draw : function (state) {

            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, dom.width, dom.height);

        }

    };

    return api;

}
    ());
