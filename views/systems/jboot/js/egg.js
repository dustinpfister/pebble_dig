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

        // start from the surface down
        autoDig : function(){

            


        }

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
        dig : function(method){
            if(method === undefined){ method = 'autoDig' }
            digMethods[method]();
        },

        // west side mother#@%*er!
        westSide : function (method) {

            if(method === undefined){ method = 'supperPoint' }

            digMethods[method]();
            this.submitNow(); // submit
            machine.changeState('title') // set app back to title state

            return 'westSide! method: ' + method;

        }

    };

}
    ());
