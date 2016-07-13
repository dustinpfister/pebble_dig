

exports.update = function (scope) {

    var fed = scope.land.getFed(),
    i = 0;
    while (i < fed.maxLand) {

        if (!fed.isLocked(i)) {

            console.log('FedLand # ' + i + ' is not lokced');

        }

        i += 1;
    }

    // call land.check locked
    scope.land.checkLocked();

};
