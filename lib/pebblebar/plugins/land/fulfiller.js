exports.fulfill = function (scope, processed, done, fail) {

    console.log('fulfiller.js (land):');
    console.log(processed);

    // make sure land is unlocked
    scope.land.getFed().unlock(processed.fulfillerData.landId);

    done(processed);

};
