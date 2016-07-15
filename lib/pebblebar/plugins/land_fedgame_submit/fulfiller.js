exports.fulfill = function (scope, processed, done, fail) {

    console.log('I think we are good.');

    done(processed);

};
