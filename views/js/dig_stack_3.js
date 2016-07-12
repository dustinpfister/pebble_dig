/*
 *    dig_stack_3.js
 *    Copyright 2016 by Dustin Pfister (GPL v3)
 *
 *    A module for working with a stack of 2d grids (3d like)
 *
 *    This version of stack_3.js has been hacked over for the game pebble_dig
 *
 */
var stack = (function () {

    // the public api
    var api = {

        w : 2,
        h : 2,
        d : 2,
        points : [],

        // set the values of the stack
        set : function (options) {

            // if no options start with an empty object
            options = options === undefined ? {}

             : options;

            // defaults or given option
            options.w = options.w === undefined ? 2 : options.w;
            options.h = options.h === undefined ? 2 : options.h;
            options.d = options.d === undefined ? 2 : options.d;
            options.val = options.val === undefined ? 0 : options.val;

            // set options
            this.w = options.w;
            this.h = options.h;
            this.d = options.d;

            // clear the grid with options
            //this.clearGrid(options.val);

        },

        // set the clients stack from the data that was given from the serve
        fromServer : function (data) {

            this.points = data.points;
            this.w = data.w;
            this.h = data.h;
            this.d = data.d;

        },

        /*
        // clear the stack to the given value
        clearGrid : function (val) {

        var i = 0,
        len = this.w * this.h * this.d;

        this.points = [];

        if (val === undefined) {
        val = 0;
        }
        while (i < len) {

        this.points[i] = {

        i : i,
        x : i % this.w,
        y : Math.floor((i - (Math.floor(i / (this.w * this.h)) * (this.w * this.h))) / this.w),
        z : Math.floor(i / (this.w * this.h)),
        val : val

        };

        i += 1;

        }

        },
         */

        // count how many points have the given value
        countVal : function (theVal) {

            var i = 0,
            len = this.w * this.h * this.d,
            count = 0;
            while (i < len) {

                if (this.points[i].val === theVal) {

                    count += 1;

                }

                i += 1;

            }

            return count;

        },

        // get a point in the matrix
        getPoint : function (ix, y, z) {

            // if y is undefined assume get by index
            if (y === undefined) {

                // return based on index
                return this.points[ix];

                // else assume get by x,y,z
            } else {

                // default to z = 0 if undefined
                if (z === undefined) {
                    z = 0;
                }

                // return based on x,y,z
                return this.points[z * (this.w * this.h) + y * this.w + ix];

            }

        }

    };

    // clear the grid
    //api.clearGrid();

    // return the public api
    return api;

}
    ());
