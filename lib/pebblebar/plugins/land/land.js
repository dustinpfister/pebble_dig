
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

/*
// fed land object
fed = {

lockedLand : [], // current array of FedLand models that are locked
lockTimeUp : 30000, // amount of time until a player took to long
maxLand : 3, // number of fedLand models that are up for digging
maxPebble : 100, // the max amount of pebble to place in a $fed account

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

};
 */

/*
exports.payUser = function (username, landId, scope, amount) {

this.getFedLandById(landId, scope, function (land) {

console.log('I need to pay user ' + username + ' ' + amount + ' pebble from land# ' + landId);

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
fulfillerPlugin : 'land_fedgame_submit',
fulfillerData : {
landId : landId
},

done : function () {},

fail : function () {}

});

}); // end get land

};
 */

/*
exports.getFed = function () {

return fed;

};
 */

/*
// place pebble amounts that add up to a max of the sum in the lands account around the land
exports.placePebble = function (scope, land) {

//console.log('reday to place pebble');

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

//console.log(stack)
while (z < stack.d) {

//console.log('layer : ' + z);
//console.log('pebbles : ' + params.layers[z]);
//console.log('divs : ' + params.divs[z]);

perDiv = Math.floor(params.layers[z] / params.divs[z]);
remain = params.layers[z] % params.divs[z];
options = [];

//console.log('perDiv: ' + perDiv);
//console.log('remain: ' + remain);

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

//console.log(point);
}

//console.log(options);
//console.log('**********');

z += 1;

}

//console.log(JSON.stringify(stack));

// throwing a wrench into it
//throw new Error('break');

land.stack3Data = JSON.stringify(stack);
land.save(function () {

//console.log('we might be good.');

});

});

};
 */

/*
// check all locked fedLand and unlock any land that needs to be unlocked
exports.checkLocked = function () {

var self = this,
now = new Date();

if (fed.lockedLand.length === 0) {

// console.log('no land is locked');

}

fed.lockedLand.forEach(function (id) {

FedLand.findOne({
id : id
}, function (err, land) {

var time;

if (land) {

time = now - new Date(land.lockedAt);

if (time >= fed.lockTimeUp) {

//console.log('to long for FedLand#: ' + land.id);

fed.unlock(land.id);

} else {

//console.log('locked time of FedLand # ' + id + ' : ' + time);

}

}

});

});

};
 */

/*
// get fedland by id of make it if it is not there
exports.getFedLandById = function (id, scope, done) {

var stack3;

if (scope.getScope) {
scope = scope.getScope()
};

FedLand.findOne({
id : id
}, function (err, land) {

if (land) {

done(land)

} else {

console.log('making new FedLand for id: ' + id);

scope.pebble.createAccount('$fed', function (accountNum) {

stack3 = new Stack({

w : 4,
h : 3,
d : 5

});

// clear to dirt, and randComp
clearToDirt(stack3);
randComp(stack3);

land = new FedLand({

id : id,
accountNum : accountNum,
digCount : 0,
stack3Data : JSON.stringify(stack3),
maxDigs : 10,
lockedAt : String(new Date())

});

land.save(function () {

done(land);

});

});

}

});

};
 */
/*
// stock the given FedLand's pebble account with pebble from the reserve account
exports.stockFedLand = function (scope, land) {

var stockUp;

if (scope.getScope) {
scope = scope.getScope()
};

scope.pebble.getReserve(function (reserve) {

//if (reserve.wallet >= fed.maxPebble) {

// get the acount of the land
scope.pebble.getAccount(land.accountNum, function (account) {

//console.log('this should be the account for FedLand id# ' + land.id);
//console.log(account);

if (account.wallet < fed.maxPebble) {

stockUp = fed.maxPebble - account.wallet;

// get the last bit of pebble if thatis all there is.
if (stockUp > reserve.wallet) {

stockUp = reserve.wallet;

}

console.log('fedLand id# ' + land.id + ' could use more pebble.');
console.log('the land could use a stockUp of : ' + stockUp);

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

console.log('well the transfer req was made');

},

fail : function () {

console.log('land.js: some kind of fail?');

}

});

} else {

//console.log('fedLand id# ' + land.id + ' is stocked.');

}

});

//}

});

};
 */

/*
// dig at federal land
exports.newFedGame = function (scope, username, done, fail) {

var id = 0,
theId = -1;
// run threw all land
while (id < fed.maxLand) {

if (!fed.isLocked(id)) {

fed.lockedLand.push(id);
theId = id;
break;

}

id += 1;
}

if (theId === -1) {

fail({

id : theId,
mess : 'all fed land is locked'

});

} else {

this.getFedLandById(theId, scope, function (land) {

land.lockedAt = String(new Date());

land.save(function () {

done({

gameType : 'fedgame',
landId : theId,
land : land

});

});

});

}

};
 */

exports.newGame = function (type, scope, username, done, fail) {

    if (done === undefined) {
        done = function () {};
    }
    if (fail === undefined) {
        fail = function () {};
    }

    // fed type game (solo, reserve, non-player)
    if (type === 'fed') {

        Land.find({
            owner : '$fed'
        }, function (err, lands) {

            console.log('amount of fed land ' + lands.length);

            if (lands) {

                var i = 0,
                len = lands.length;
                while (i < len) {

                    console.log(conf.isLocked(lands[i].id));

                    i += 1;

                }

            }

        });

    }

    done({
        foo : 'bar'
    });

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
exports.createLand = function (owner, scope) {

    var stack3,
    accountNum,
    options;

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
        lockedAt : String(new Date())

    };

    // if for $fed (solo land, reserve land)
    if (owner === '$fed') {

        options.accountNum = 'reserve';
        makeLand(options, function () {

            console.log('new fed land');

        })

        // else if new user land we will need to use there prime account
    } else {

        scope.users.getUserPrime(owner, function (account) {

            options.accountNum = account.accountNumber;
            makeLand(options, function () {

                console.log('new fed land');

            })

        }, function () {});

    }

};

exports.setup = function (app, db, scope) {

    console.log('land.js : land.setup called, defining Land Collection...');

    Land = db.model('land', new Schema({

                id : Number, // an id for the land
                owner : String, // the owner of the land
                accountNum : String, // the account number that holds pebble that is repersenetd in the land
                stack3Data : String, // the current stackData of the land
                lockedAt : String // a timestap that is the time at which it was last locked

            }));

    Land.find({}, function (err, land) {

        console.log('setting conf.count=' + (land.length - 1));
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

                //console.log(i)
                self.createLand('$fed', scope.getScope());

                i += 1;

            }

        }

    });

    /*
    // define the fed land collection
    FedLand = db.model('land_fed', new Schema({

    id : Number, // the id of the Fedland

    // the account number in the pebble accounts collcetion that holds pebble that is up for grabs from the Reserve
    accountNum : String,
    digCount : Number, // the number of times the land has been diged
    stack3Data : String, // the stack3 state of the land
    maxDigs : Number, // the max number of digs allowed on the land
    lockedAt : String // the time at which the land was locked

    }));


    // loop threw all FedLand, creating land if it is not there.
    var id = 0,
    self = this,
    land;
    while (id < fed.maxLand) {

    // this method will get a FedLand model, or create and get it.
    this.getFedLandById(id, scope, function (land) {

    //console.log(land);
    // stcok the land if it can be done
    self.stockFedLand(scope, land);

    });

    id += 1;
    }

     */

};
