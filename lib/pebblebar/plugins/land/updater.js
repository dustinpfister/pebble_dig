

exports.update = function (scope) {

    var fed = scope.land.getFed(),
    i = 0;
    while (i < fed.maxLand) {

        if (!fed.isLocked(i)) {

            //console.log('FedLand # ' + i + ' is not lokced');

            scope.land.getFedLandById(i, scope, function (land) {

                console.log('FedLand # ' + land.id + ' is not locked');
                console.log('digCount : ' + land.digCount);
                console.log('accountNumber: ' + land.accountNum);

            })

        }

        i += 1;
    }

    // call land.check locked
    scope.land.checkLocked();

};
