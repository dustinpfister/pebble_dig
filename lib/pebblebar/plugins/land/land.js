
var mongoose = require('mongoose'), Schema = mongoose.Schema,
Stack = require('./digserver_stack_3.js').Stack,
pebDist = require('./pebble_dist.js'),

// will hold possible future Land model
Land,

// will hold FedLand database model
FedLand,

// conf object
conf = {

    count : 0, // this is whats used to know the current id
    lockedLand : [], // current array of FedLand models that are locked
    lockTimeUp : 30000, // amount of time until a player took to long
    maxFedLand : 3, // number of fedLand models that are up for digging
    maxFedPebble : 100, // the max amount of pebble to place in a $fed account

    // is the given id locked?
    isLocked : function (id) {

        var i = 0,
        len = this.lockedLand.length;
        while (i < len) {

            if (this.lockedLand[i] === id) {

                return true;

            }

            i += 1;
        }

        return false;

    },

    // unlock the given id
    unlock : function (id) {

        var i = this.lockedLand.length;
        while (i--) {

            if (this.lockedLand[i] === id) {

                this.lockedLand.splice(i, 1);
                break;

            }

        }

    }

},

// clear the given stackdata to dirt
clearToDirt = function (stackData) {

    stackData.clearGrid({

        amount : 0, // amount of pebble
        comp : [// compostion of section

            // * if this array is empty that means it is an empty space
            // * one or more obejcts means there is "stuff"
            // * the object contains just an id (what the stuff is), and a per (percent of the section is stuff)

            {
                id : 0, // id 0 shall be dirt
                per : 1 // the section is compleatly dirt
            }

        ],
        clicks : 1 // the number of clicks to dig the section

    });

},

// randomize the composition of stackData
randComp = function (stackData) {

    stackData.points.forEach(function (point) {

        point.val = {

            amount : 0,
            comp : [{

                    id : Math.floor(Math.random() * 2),
                    per : 1

                }
            ]

        };

    });

};

// pay an ammount of pebble from the account of the land of the given id to the prime account of the given username
exports.payUser = function (username, landId, scope, amount) {

    this.getLandById(landId, scope, function (land) {

        scope.pebble.transferRequest({

            from : {
                getBy : 'accountNumber',
                accountNumber : land.accountNum
            },
            to : {
                getBy : 'username',
                username : username
            },
            amount : amount,
            fulfillerPlugin : 'land_submit',
            fulfillerData : {
                landId : landId
            },

            done : function () {},

            fail : function () {}

        });

    }); // end get land

};

// place pebble amounts that add up to a max of the sum in the lands account around the land
exports.placePebble = function (scope, land) {

    scope.pebble.getAccount(land.accountNum, function (account) {

        var pointI,
        point,
        stack = new Stack(JSON.parse(land.stack3Data)),
        params = pebDist.getDistParams(account.wallet, stack.w, stack.h, stack.d),

        z = 0,
        a = stack.w * stack.h,
        i,
        iLen,
        perDiv,
        remain,
        options;
        while (z < stack.d) {

            perDiv = Math.floor(params.layers[z] / params.divs[z]);
            remain = params.layers[z] % params.divs[z];
            options = [];

            // build options array, and default amounts to 0
            i = z * a;
            iLen = i + a;
            while (i < iLen) {

                // set amount to 0
                stack.getPoint(i).val.amount = 0;

                // push the option
                options.push(i);
                i += 1;
            }

            i = params.divs[z];
            while (i--) {

                pointI = options.splice(Math.floor(Math.random() * options.length), 1)[0];
                point = stack.getPoint(pointI);

                point.val.amount = perDiv;

                if (i === 0) {

                    point.val.amount += remain;

                }

            }

            z += 1;

        }

        land.stack3Data = JSON.stringify(stack);
        land.save(function () {});

    });

};

// stock the given land account with pebble from the reserve account (applys to fed land only)
exports.stockLand = function (scope, land) {

    var stockUp;

    if (scope.getScope) {
        scope = scope.getScope()
    };

    scope.pebble.getReserve(function (reserve) {

        // get the acount of the land
        scope.pebble.getAccount(land.accountNum, function (account) {

            if (account.wallet < conf.maxFedPebble) {

                stockUp = conf.maxFedPebble - account.wallet;

                // get the last bit of pebble if thatis all there is.
                if (stockUp > reserve.wallet) {

                    stockUp = reserve.wallet;

                }

                scope.pebble.transferRequest({

                    // from the reserve
                    from : {
                        getBy : 'reserve'
                    },

                    // to the account of the FedLand
                    to : {
                        getBy : 'accountNumber',
                        accountNumber : land.accountNum
                    },

                    amount : stockUp,

                    fulfillerPlugin : 'land',
                    fulfillerData : {

                        landId : land.id

                    },

                    done : function () {

                        // the request was made

                    },

                    fail : function () {

                        // there was a problem making the request

                    }

                });

            } else {

                // the land is will stcoked

            }

        });

    });

};

// do a lock check on the given land
exports.lockCheck = function (land) {

    var time = new Date() - new Date(land.lockedAt);

    if (time >= conf.lockTimeUp) {

        conf.unlock(land.id);

    }

};

// get all the fed Lands
exports.getFedLands = function (done) {

    Land.find({
        owner : '$fed'
    }, function (err, lands) {

        done(lands);

    });

};

exports.getConf = function () {

    return conf;

};

// get an unlocked fed land (land.newGame helper)
var getFedLand = function (done, fail) {

    if (done === undefined) {
        done = function () {};
    }
    if (fail === undefined) {
        fail = function () {};
    }

    Land.find({
        owner : '$fed'
    },

        function (err, lands) {

        // if err we fail becuase of err
        if (err) {

            fail();

        } else {

            // if lands
            if (lands) {

                done();

                // else we fail becuase we do not have any lands
            } else {

                fail();

            }

        }

    });

};

exports.newGame = function (type, scope, username, done, fail) {

    var theId = -1,
    self = this;

    if (done === undefined) {
        done = function () {};
    }
    if (fail === undefined) {
        fail = function () {};
    }

    // fed type game (solo, reserve, non-player)
	/*
    if (type === 'fed') {

        Land.find({
            owner : '$fed'
        }, function (err, lands) {

            if (lands) {

                var i = 0,
                len = lands.length;
                while (i < len) {

                    if (!conf.isLocked(lands[i].id)) {

                        conf.lockedLand.push(lands[i].id);
                        theId = lands[i].id;

                        break;

                    }

                    i += 1;

                }

                // if we have an id
                if (theId != -1) {

                    self.getLandById(theId, scope,

                        // done getting land
                        function (land) {

                        land.lockedAt = String(new Date());

                        land.save(function () {

                            done({
                                succes : true,
                                type : 'fed',
                                landId : theId,
                                land : land

                            });

                        })

                    },

                        // fail getting land
                        function () {

                        fail({
                            succes : false,
                            mess : 'fail getting land'
                        });

                    });

                } else {

                    fail({
                        succes : false,
                        mess : 'all land is locked'
                    })

                }

            } else {

                fail({
                    succes : false,
                    mess : 'could not get lands'
                })

            }

        });

    }
	*/

};
// the new getLandById
exports.getLandById = function (id, scope, done, fail) {

    if (done === undefined) {
        done = function () {};
    }
    if (fail === undefined) {
        fail = function () {};
    }

    Land.findOne({
        id : id
    }, function (err, land) {

        if (err) {

            fail();

        } else {

            if (land) {

                done(land);

            } else {

                fail();

            }

        }

    });

};

// helper for exports.createLand
var makeLand = function (options, done) {

    // make the new land object
    var newLand = new Land(options);

    newLand.save(function () {

        done()

    })

};

// make a new land stack for the given owner
exports.createLand = function (owner, scope, done) {

    var stack3,
    accountNum,
    options;

    if (done === undefined) {
        done = function () {};
    }

    // do this first, so that if a new request comes in right after we don't end up with the same id twice
    conf.count += 1;

    stack3 = new Stack({

            w : 4,
            h : 3,
            d : 5

        });

    // clear to dirt, and randComp
    clearToDirt(stack3);
    randComp(stack3);

    options = {

        id : conf.count,
        owner : owner,
        accountNum : accountNum,
        stack3Data : JSON.stringify(stack3),
        lockedAt : String(new Date()),
        maxDigs : Math.floor(stack3.points.length * 0.2)

    };

    // if for $fed (solo land, reserve land)
    if (owner === '$fed') {

        // we create a pebble account for the land that is independant of the reserve
        scope.pebble.createAccount('$fed', function (accountNumber) {

            options.accountNum = accountNumber;
            makeLand(options, function () {

                done();

            });

        });

        // else if new user land we will need to use there prime account
    } else {

        scope.users.getUserPrime(owner, function (account) {

            options.accountNum = account.accountNumber;
            makeLand(options, function () {

                done();

            })

        }, function () {});

    }

};

exports.setup = function (app, db, scope) {

    Land = db.model('land', new Schema({

                id : Number, // an id for the land
                owner : String, // the owner of the land
                accountNum : String, // the account number that holds pebble that is repersenetd in the land
                stack3Data : String, // the current stackData of the land
                lockedAt : String, // a timestap that is the time at which it was last locked
                maxDigs : Number // max digs allowed in the land

            }));

    Land.find({}, function (err, land) {

        conf.count = land.length - 1;

    });

    var self = this;

    Land.find({
        owner : '$fed'
    }, function (err, lands) {

        var fedCount = lands.length,
        i = 0;

        if (fedCount < conf.maxFedLand) {

            i = fedCount;
            while (i < conf.maxFedLand) {

                self.createLand('$fed', scope.getScope());

                i += 1;

            }

        }

    });

};
