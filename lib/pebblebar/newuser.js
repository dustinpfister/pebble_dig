
var scope = require('./scope.js').getScope();

// what to do for a new user once they sign up.
exports.forNewUser = function(username, done){

    scope.users.findByUsername(username, function(err,user){

        // ALERT! just hardcoding them in for now
        require('./plugins/land/newuser.js').forNewUser(user,scope, function(){

        });

    });

    done();

};