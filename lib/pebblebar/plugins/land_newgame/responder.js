

exports.createAppResponse = function (clientData, req, res, scope, done) {

    scope.land.newLand(scope, req.user.username);

    done({

        plugin : 'land_newgame'

    });

};
