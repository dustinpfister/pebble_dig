

exports.createAppResponse = function (clientData, req, res, scope, done) {

    scope.land.newFedGame(

        scope,
        req.user.username,

        // done
        function (fedGame) {

        scope.pebble.getAccount(fedGame.land.accountNum, function (account) {

            fedGame.wallet = account.wallet;

            done({

                plugin : 'land_newfedgame',
                success : true,
                mess : 'new game started',
                fedGame : fedGame

            });

        });

    },

        // fail
        function (fedGame) {

        done({

            plugin : 'land_newfedgame',
            success : false,
            mess : 'an error happened.',
            fedGame : fedGame

        });

    });

};
