

exports.update = function (scope) {

    var conf = scope.land.getConf();

    // update fed lands
    scope.land.getFedLands(function (lands) {

        lands.forEach(function (land) {

            if (conf.isLocked(land.id)) {

                scope.land.lockCheck(land);

            } else {

                // re-stock request
                scope.land.stockLand(scope, land);

                // place any pebble that may be in the account
                scope.land.placePebble(scope, land);

            }

        });

    });

    // update user lands
    scope.land.getUserLands(function (lands) {

        lands.forEach(function (land) {

            if (conf.isLocked(land.id)) {

                scope.land.lockCheck(land);

            }

        });

    });

};
