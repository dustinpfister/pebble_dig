

exports.createAppResponse = function (clientData, req, res, scope, done) {

    console.log('I shall be the new thing');

    if (clientData.type === 'fed') {

        scope.land.newGame('fed', scope, req.body.username, function (game) {

            done({

                plugin : 'land_newgame',
                mess : 'solo game',
                type : 'fed',
                success : true,
                game : game

            });

        });

    } else {

        if (clientData.type === 'pvp') {

            done({

                plugin : 'land_newgame',
                mess : 'pvp game'

            });

        } else {

            done({

                plugin : 'land_newgame',
                mess : 'unkown game type'

            });

        }

    }

};
