/*
 *    game.js
 *    Copyright 2016 by Dustin Pfister (GPL v3)
 *
 *    the client side game state for pebble_dig
 *
 */

var game = (function () {

    // Client State (cs)
    var cs = {

        username : '', // the username of the player
        attackingUsername : '', // the username of the player you are attacking
        layer : 0,
        digs : 0,
        userWallet : 0, // the amount of pebble in the users waller
        pebbleDelta : 0, // the amount of pebble the user may have won so far
        pebbleInLand : 0, // the total amount of pebble in the land
        landId : '', // the id of the land being diged
        gameOver : false

    },

    api = {

	    /*
        userAction : function (type, x, y) {

            console.log('user action type: ' + type);
            console.log('position: ' + x + ',' + y);

        },
		*/
		
		userAction : function(action){
			
			console.log(action);
			
		},

        newGame : function (type) {

            // just go ahead and start a new game for now.
            peb({

                action : 'pebblebar',
                clientData : [{
                        plugin : 'land_newgame',
                        type : 'pvp'
                    }
                ]

            }, function (data) {

                cs.username = data.userData.username;
                cs.wallet = data.userData.primeWallet;

                // all responces
                data.response.forEach(function (res) {

                    // if a new game response, set up the clinets stack
                    if (res.plugin === 'land_newgame') {

                        if (res.success) {

                            if (res.game.land) {

                                // update the stack to the fed land
                                stack.fromServer(JSON.parse(res.game.land.stack3Data));

                                // set client state max digs to max digs allowed
                                cs.digs = res.game.land.maxDigs;
                                cs.attackingUsername = res.game.land.owner;
                                cs.pebbleInLand = res.game.wallet;
                                cs.pebbleDelta = 0;
                                cs.landId = res.game.landId;
                                cs.gameOver = false;

                            } else {

                                // what to do if no land object

                            }

                        } else {

                            // what to do for false sucess: (all land may be locked)

                        }

                    }

                });

            });

        },

        // get the current client state
        getCS : function () {

            return cs;

        }

    };

    return api;

}
    ());
