exports.fulfill = function (scope, processed, done, fail) {

    // logg for tax if success
    if(processed.messCode === 0){

        // logg the amount 
        scope.tax.income(processed.fulfillerData.toName, scope, processed.amount);

    }

    done(processed);

};
