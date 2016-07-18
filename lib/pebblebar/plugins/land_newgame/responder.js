

exports.createAppResponse = function (clientData, req, res, scope, done) {

    console.log('I shall be the new thing');

    if (clientData.type === 'fed') {

        scope.land.newGame('fed', scope, req.body.username,

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

    } else {

        if (clientData.type === 'pvp') {

            done({

                plugin : 'land_newgame',
                mess : 'pvp game',
                game : {},
                success : true

            });

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
