exports.fulfill = function (scope, processed, done, fail) {

    if (done === undefined) {
        done = function () {};
    }
    if (fail === undefined) {
        fail = function () {};
    }

    console.log('we have the power!');
    console.log(processed);

    done(processed);

};
