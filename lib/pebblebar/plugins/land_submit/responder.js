
var findEmptys = function (stackData) {

    var emptys = [];

    stackData.points.forEach(function (pt) {

        if (pt.val.comp.length === 0) {

            emptys.push(pt);

        }

    }); ;

    return emptys;

};

exports.createAppResponse = function (clientData, req, res, scope, done) {

    var stackData = JSON.parse(clientData.stack3Data),
    emptys = findEmptys(stackData),
    total = 0;

    emptys.forEach(function (empty) {

        total += empty.val.amount;

    });

    //console.log('player found : ' + total);

    //scope.land.payUser(req.user.username, clientData.landId, scope, total);

    done({

        plugin : 'land_submit',
        total : total

    });

};
