

exports.createAppResponse = function (clientData, req, res, scope, done) {

    console.log('I shall be the new thing');

    if (clientData.type === 'fed') {

        scope.land.newGame('fed', scope, req.user.username,

            // done starting new game
            function (game) {

            scope.pebble.getAccount(game.land.accountNum, function (account) {

                game.wallet = account.wallet;

                done({

                    plugin : 'land_newgame',
                    mess : 'solo game',
                    type : 'fed',
                    success : true,
                    game : game

                });

            });

        },

            // fail starting new game
            function (err) {

            done({

                plugin : 'land_newgame',
                mess : 'solo game',
                type : 'fed',
                success : false,
                err : err,
                game : {}

            });

        });

        // if not 'fed'
    } else {

        // if 'pvp'
        if (clientData.type === 'pvp') {

            /*
            done({

            plugin : 'land_newgame',
            mess : 'pvp game',
            game : {},
            success : true

            });

             */

            scope.land.newGame('pvp', scope, req.user.username,

                // done starting new game
                function (game) {
					
					console.log('we are good');

                scope.pebble.getAccount(game.land.accountNum,

                    // done starting new 'pvp' game
                    function (account) {

                    game.wallet = account.wallet;

                    done({

                        plugin : 'land_newgame',
                        mess : 'pvp game',
                        type : 'pvp',
                        success : true,
                        game : game

                    });

                });

            },

                // fail starting new 'pvp' game
                function (err) {

                done({

                    plugin : 'land_newgame',
                    mess : 'pvp game',
                    type : 'fed',
                    success : false,
                    err : err,
                    game : {}

                });

            });

            // if not 'fed' or 'pvp'
        } else {

            done({

                plugin : 'land_newgame',
                mess : 'unkown game type',
                success : false,
                game : {}

            });

        }

    }

};
