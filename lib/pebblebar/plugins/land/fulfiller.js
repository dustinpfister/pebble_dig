exports.fulfill = function (scope, processed, done, fail) {

    console.log('we have the power!');
    console.log(processed);

    done(processed);

};
