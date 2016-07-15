
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

    console.log(findEmptys(JSON.parse(clientData.stack3Data)));

    done({

        plugin : 'land_fedgame_submit'

    });

};
