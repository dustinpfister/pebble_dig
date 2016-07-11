

exports.createAppResponse = function (clientData, req, res, scope, done) {

    scope.land.newSoloLand(

        scope,
        req.user.username,

        // done
        function (pluginData) {

            done({

                plugin : 'land_newgame',
                mess: 'new game started',
                pluginData: pluginData

            });

        },

        // fail
        function () {

            done({

                plugin : 'land_newgame',
                mess : 'an error happened.',
                pluginData : {}

            });

        }

    );

};
