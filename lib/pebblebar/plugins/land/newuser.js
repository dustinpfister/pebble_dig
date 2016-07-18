exports.forNewUser = function (user, scope, done) {

    console.log('newuser.js (land):');

    scope.land.createLand(user.username, scope, function () {

        console.log('check the database do we have a new land for the user you just made?');

        done();

    });

};
