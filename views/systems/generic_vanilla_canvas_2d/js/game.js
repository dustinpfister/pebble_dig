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

    // compute and append dig count based on comp of stack 3 points val object.
    computeComp = function (point) {

        //if not count compute and append
        var i = 0,
        len = point.val.comp.length,
        hp = 0,

        // the hp multis for each dirt type
        types = [
            1, // dirt
            5 // rock
        ];
        while (i < len) {

            //console.log(point.val.comp[i]);

            hp += types[point.val.comp[i].id] * point.val.comp[i].per

            i += 1;

        }

        //console.log(hp);
        point.hp = hp;

    },

    api = {

        userAction : function (action) {

            var point = stack.getPoint(action.cellX, action.cellY, cs.layer);

            if (!cs.gameOver && stack.points.length > 0) {

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

                        if (point.hp === undefined) {

                            computeComp(point);

                        }

                        if (point.hp) {

                            console.log('digging');

                            cs.digs -= 1;
                            point.hp -= 1;

                        }

                        if (point.hp <= 0) {

                            console.log('done digging');

                            cs.pebbleDelta += point.val.amount;
                            point.val.comp = [];
                        }

                        if (cs.digs <= 0) {

                            console.log('out of digs, the game is over.');

                            cs.gameOver = true;
                            submit(stack);

                        }

                    }

                }

            } else {

                console.log('the game is over, or there is a problem.');

            }

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