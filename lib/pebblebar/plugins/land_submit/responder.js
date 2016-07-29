
var findEmptys = function (stackData) {

    var emptys = [];

    stackData.points.forEach(function (pt) {

        if (pt.val.comp.length === 0) {

            emptys.push(pt);

        }

    }); ;

    return emptys;

},

// total up all the pebble won
totalEmptys = function (emptys) {

    var total = 0;

    emptys.forEach(function (empty) {

        total += empty.val.amount;

    });

    return total;

},

checkMethods = [

    function (result, stack, land, clientData, scope) {

        var emptys = findEmptys(stack);

        if (emptys.length > land.maxDigs) {

            result.pass = false;
            result.mess.push('dug points exceeds maxDigs allowed on land.');

        }

    }

],

check = function (clientData, scope, req, res, done) {

    var result = {

        pass : true,
        mess : []

    },
    stack = JSON.parse(clientData.stack3Data);

    scope.land.getLandById(clientData.landId, scope,

        // done getting land
        function (land) {

            checkMethods.forEach(function (check) {

                check(result, stack, land, clientData, scope, req, res);

            });

            //result.pass = false;
            //result.mess.push('new stack cheking not working yet.');

            done(result)

        },

        // fail getting land
        function () {

            result.pass = false;
            result.mess.push('error getting land');
            done(result);

        }

    );

};

exports.createAppResponse = function (clientData, req, res, scope, done) {

    var total = 0,
    stack = JSON.parse(clientData.stack3Data),
    emptys = findEmptys(stack);

    check(clientData, scope, req, res, function(result){

        // if sucessful sanatation 
        if(result.pass){

            total += totalEmptys(emptys);
            scope.land.payUser(req.user.username, clientData.landId, scope, total);
            result.mess.push('the pebble transaction was started');

        }

        // unlock
        scope.land.getConf().unlock(clientData.landId);

        done({

            plugin : 'land_submit',
            succes : result.pass,
            mess : result.mess,
            total : 0

        });

    });

};


/*
exports.createAppResponse = function (clientData, req, res, scope, done) {

    var stackData = JSON.parse(clientData.stack3Data),
    emptys = findEmptys(stackData),
    total = 0;

    scope.land.getLandById(clientData.landId, scope,

        // done
        function (land) {

        // is someone hacking? ( emptys > land.maxDigs)
        if (emptys.length > land.maxDigs) {

            done({

                plugin : 'land_submit',
                succes : false,
                mess : 'nice try hacker. (emptys > land.maxDigs)',
                total : total

            });

            // unlock
            scope.land.getConf().unlock(clientData.landId);

        } else {

            total += totalEmptys(emptys);
            scope.land.payUser(req.user.username, clientData.landId, scope, total);

            // unlock
            scope.land.getConf().unlock(clientData.landId);

            done({

                plugin : 'land_submit',
                succes : true,
                mess : 'a pebble transfer request was made',
                total : total

            });

        }

    },

        // fail getting land
        function () {

        done({

            plugin : 'land_submit',
            succes : false,
            mess : 'error getting land.',
            total : total

        });

    });

};
*/
