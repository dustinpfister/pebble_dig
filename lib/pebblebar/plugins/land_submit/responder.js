
var findEmptys = function (stackData) {

    var emptys = [];

    stackData.points.forEach(function (pt) {

        if(typeof pt === 'object'){

            if (pt.val.comp.length === 0) {

                emptys.push(pt);

            }

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

    // make sure dug points does not exceed max digs allowd on the land.
    function (result, stack, land, clientData, scope) {

        var emptys = findEmptys(stack);

        if (emptys.length > land.maxDigs) {

            result.pass = false;
            result.mess.push('dug points exceeds maxDigs allowed on land.');

        }

    },

    // check to make sure that emptys go from the surface down. 
    function (result, stack, land, clientData, scope) {

        //console.log(JSON.parse(land.stack3Data));
        var l = 0,
        a = stack.w * stack.h,
        dugLayers = [],    // which layers have one or more dug points
        currentLayer, 
        p;

        while(l < stack.d){

            currentLayer = stack.points.slice( a * l, a * l + a );
            p=0;
            while(p < currentLayer.length){

                if(currentLayer[p].val.comp.length === 0){

                    dugLayers.push(l);
                    break;

                }

                p += 1;

            }

            l += 1;

        }

        if(dugLayers.length > 0){

            l = 0;
            while(l < dugLayers.length){

                if(l != dugLayers[l]){

                    result.pass = false;
                    result.mess.push('you did not dig starting at the surface.');
                    break;

                }

                l += 1;

            }

        }

    },

    // confirm dimensions by comparing submitted stack to stack data in the land collection
    function(result, stack, land, clientData, scope){

        console.log('but i have a cristal ball.');
        console.log();

        serverStack = JSON.parse(land.stack3Data);

        // do they have the same width, height, and depth?
        if(stack.w !== serverStack.w || stack.w !== serverStack.w || stack.w !== serverStack.w){

            result.pass = false;
            result.mess.push('the submited w,h,d does not match what is on the server.');

        }

        // is the length of both points arrays the same?
        if( stack.points.length !== serverStack.points.length){

            result.pass = false;
            result.mess.push('length of points array submited does not equal what is on the server.');

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
