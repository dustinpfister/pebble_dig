// the egg object contains methods that can be used to cheat, automate the game, ect.
var egg = (function () {


    return {

        // (defeated in 1.7.x) dig all points in the stack
        digAll : function () {

            console.log('digging all points...');
            console.log('num of points: ' + stack.points.length);

            stack.points.forEach(function (point) {

                if (typeof point.val === 'object') {

                    // and empty comp array counts as empty space
                    point.val.comp = [];

                }

            });

            // return empty string to console
            return '';

        },

        // (defeated in 1.7.x) dig emptys that have pebble up to the max digs
        targetedDigs : function(){

            var i = stack.points.length, digs = 0, total=0,point,
            max = game.getCS().digs;

            while(i--){

                point = stack.points[i];

                if (typeof point.val === 'object') {

                    if(point.val.amount > 0){

                        // and empty comp array counts as empty space
                        point.val.comp = [];
                        total += point.val.amount;
                        digs += 1;

                        if(digs === max){

                            break;

                        }

                    }

                }

            }

            game.getCS().digs = 0;

            return 'refromed basic targeted dig, found ' + total + ' pebble using ' + digs + ' digs.';

        },

        // (defeated in 1.7.x) set amount of stack point 0,0,0 to the total amount of pebble in the stack
        supperPoint : function(){

            var maxPeb;

            if(stack.points.length > 0){

                maxPeb = game.getCS().pebbleInLand;
                stack.getPoint(0,0,0).val.amount = maxPeb;
                stack.getPoint(0,0,0).val.comp = [];

            }

        },

        submitNow : function () {

            console.log('submitting the current stack to land_submit plugin');

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

                console.log('egg.submitNow: the response');
                console.log(res.response[0]);

            });

            // return empty string to console.
            return '';

        },

        // west side mother#@%*er!
        westSide : function(){

            //this.digAll();  // dig all points
            //this.targetedDigs();
            this.supperPoint();
            this.submitNow(); // submit
            machine.changeState('title') // set app back to title state

        }

    };

}
    ());