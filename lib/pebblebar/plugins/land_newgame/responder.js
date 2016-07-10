

exports.createAppResponse = function (clientData, req, res, scope, done) {

    scope.land.newSoloLand(scope, req.user.username);

    done({

        plugin : 'land_newgame'

    });

};
