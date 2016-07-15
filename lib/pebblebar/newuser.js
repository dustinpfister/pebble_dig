
var scope = require('./scope.js').getScope();

// what to do for a new user once they sign up.
exports.forNewUser = function(username, done){

    console.log('newuser.js');
    console.log('hello new user : ' + username);

    done();

};