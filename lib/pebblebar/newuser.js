
var scope = require('./scope.js').getScope();

// what to do for a new user once they sign up.
exports.forNewUser = function(username, done){

    console.log('newuser.js');
    scope.users.findByUsername(username, function(err,user){

        console.log('hello new user : ' + username);
        console.log(user);

    });

    done();

};