exports.fulfill = function (scope, processed, done, fail) {

    console.log('fulfiller.js (land_submit)');

    scope.land.getFedLandById(processed.fulfillerData.landId, scope, function(land){

        // re-stock request
        scope.land.stockFedLand(scope, land);

        //console.log(land);

    });

    done(processed);

};
