exports.fulfill = function (scope, processed, done, fail) {

    // logg for tax if success
    if(processed.messCode === 0){

        // pay any tax that is all ready there.
        scope.tax.payTax(processed.fulfillerData.toName, scope);

        // logg the amount 
        scope.tax.income(processed.fulfillerData.toName, scope, processed.amount);

    }

    // re-stock request
    //scope.land.stockLand(scope, land);

    // place any pebble that may be in the account
    //scope.land.placePebble(scope, land);


    done(processed);

};
