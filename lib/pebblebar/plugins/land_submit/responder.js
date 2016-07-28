
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

};

exports.createAppResponse = function (clientData, req, res, scope, done) {

    var stackData = JSON.parse(clientData.stack3Data),
    emptys = findEmptys(stackData),
    total = 0;

    scope.land.getLandById(clientData.landId, scope,

        // done
        function (land) {

            // is someone hacking? ( emptys > land.maxDigs)
            if(emptys.length > land.maxDigs){

                done({

                    plugin : 'land_submit',
                    succes : false,
                    mess : 'nice try hacker. (emptys > land.maxDigs)',
                    total : total

                });

            }else{

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
                mess: 'error getting land.',
                total : total

            });

        }

    );

};
