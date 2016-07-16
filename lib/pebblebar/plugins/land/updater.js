

exports.update = function (scope) {

    console.log('land updater needs to be fixed');

    var conf = scope.land.getConf();

    scope.land.getFedLands(function (lands) {

        console.log('okay this might work');
        console.log(lands.length);

        lands.forEach(function (land) {

        //console.log('land id :' + land.id + ' locked is ' + conf.isLocked(land.id));

            console.log('land id :' + land.id);

            if (conf.isLocked(land.id)) {

                console.log('land is locked');
                console.log('lockedAt :' + land.lockedAt);

                scope.land.lockCheck(land);

            } else {

                console.log('land is not locked');

            }

        });

    });

/*
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
	*/

};
