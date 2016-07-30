// the egg object contains methods that can be used to cheat, automate the game, ect.
var egg = (function () {

    var digMethods = {

        // (defeated in 1.7.x) dig all points in the stack
        digAll : function () {

            stack.points.forEach(function (point) {

                if (typeof point.val === 'object') {

                    // and empty comp array counts as empty space
                    point.val.comp = [];

                }

            });

        },

        // (defeated in 1.7.x) dig emptys that have pebble up to the max digs
        targetedDigs : function () {

            var i = stack.points.length,
            digs = 0,
            total = 0,
            point,
            max = game.getCS().digs;
            while (i--) {

                point = stack.points[i];

                if (typeof point.val === 'object') {

                    if (point.val.amount > 0) {

                        // and empty comp array counts as empty space
                        point.val.comp = [];
                        total += point.val.amount;
                        digs += 1;

                        if (digs === max) {

                            break;

                        }

                    }

                }

            }

            game.getCS().digs = 0;

        },

        // (defeated in 1.7.x) set amount of stack point 0,0,0 to the total amount of pebble in the stack
        supperPoint : function () {

            var maxPeb;

            if (stack.points.length > 0) {

                maxPeb = game.getCS().pebbleInLand;
                stack.getPoint(0, 0, 0).val.amount = maxPeb;
                stack.getPoint(0, 0, 0).val.comp = [];

            }

        },

        // start from the surface down, digging the points with the most pebble along the way
        autoDig : function () {

            var digs = game.getCS().digs,
            z = 0,
            a = stack.w * stack.h,
            i,
            iLen,
            digAt,
            best = 0; ;

            // for each layer
            while (z < stack.d) {

                // find best
                best = 0;
                i = a * z;
                digAt = i;
                iLen = i + a;
                while (i < iLen) {

                    if (stack.points[i].val.amount > best) {

                        digAt = i;
                        best = stack.points[i].val.amount;

                    }

                    i += 1;

                }

                // dig point
                stack.points[digAt].val.comp = [];
                digs -= 1;

                // break if you run out of digs
                if (digs === 0) {

                    break;

                }

                z += 1;

            }

            // use remaining digs from the bottom up
            if (digs > 0) {

                i = stack.points.length;
                while (i--) {

                    if (stack.points[i].val.amount > 0 && stack.points[i].val.comp.length > 0) {

                        // dig
                        stack.points[i].val.comp = [];
                        digs -= 1;

                    }

                    if (digs === 0) {

                        break;

                    }

                }

            }

        }

    },

    play = function () {

        var method = 'autoDig';

        game.newGame('pvp',

            // new game
            function (res) {

            console.log('new game!');
            console.log(res);

            // set machine state to game
            machine.changeState('game');

            // dig the land
            digMethods[method]();

        },

            // fail starting new game
            function () {

            console.log('something is wrong.');
			
			// set to title
            machine.changeState('title');

        })

    };

    // egg public api
    return {

        // submit the current stack now.
        submitNow : function () {

            peb({

                action : 'pebblebar',
                clientData : [{
                        //plugin : 'land_game_submit',
                        plugin : 'land_submit',
                        landId : game.getCS().landId,
                        stack3Data : JSON.stringify(stack)
                    }
                ]

            }, function (res) {

                console.log(res.response[0]);

            });

            // return empty string to console.
            return '';

        },

        // just dig with the given method
        dig : function (method) {
            if (method === undefined) {
                method = 'autoDig'
            }
            digMethods[method]();
        },

        // west side mother#@%*er!
        westSide : function (method) {

            if (method === undefined) {
                method = 'autoDig'
            }

            digMethods[method]();
            this.submitNow(); // submit
            machine.changeState('title') // set app back to title state

            return 'westSide! method: ' + method;

        },

        autoPlay : function () {

            play();

        }

    };

}
    ());
