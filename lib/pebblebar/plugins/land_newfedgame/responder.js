

exports.createAppResponse = function (clientData, req, res, scope, done) {

    scope.land.newFedGame(

        scope,
        req.user.username,

        // done
        function (fedGame) {

            done({

                plugin : 'land_newgame',
                mess: 'new game started',
                fedGame: fedGame

            });

        },

        // fail
        function () {

            done({

                plugin : 'land_newgame',
                mess : 'an error happened.',
                fedGame : {}

            });

        }

    );

};
