exports.fulfill = function (scope, processed, done, fail) {

    console.log('fulfiller.js ALERT! you need to update me if you want the land restocked on fulfillment of pebble transfer.');

    //scope.land.getFedLandById(processed.fulfillerData.landId, scope, function(land){

        // re-stock request
    //    scope.land.stockFedLand(scope, land);

        //console.log(land);

    //});

    done(processed);

};
