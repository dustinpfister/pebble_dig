exports.fulfill = function (scope, processed, done, fail) {

    // make sure land is unlocked
    scope.land.getConf().unlock(processed.fulfillerData.landId);

    done(processed);

};
