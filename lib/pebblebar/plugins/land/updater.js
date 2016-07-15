

exports.update = function (scope) {

    var fed = scope.land.getFed(),
    i = 0;
    while (i < fed.maxLand) {

        if (!fed.isLocked(i)) {

            scope.land.getFedLandById(i, scope, function (land) {

                // re-stock request
                scope.land.stockFedLand(scope, land);

                // place any pebble that may be in the account
                scope.land.placePebble(scope, land);

            })

        }

        i += 1;
    }

    // call land.check locked
    scope.land.checkLocked();

};
