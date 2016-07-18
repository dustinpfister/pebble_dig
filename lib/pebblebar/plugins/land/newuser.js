exports.forNewUser = function (user, scope, done) {

    scope.land.createLand(user.username, scope, function () {

        done();

    });

};
