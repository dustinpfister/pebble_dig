
var mongoose = require('mongoose'), Schema = mongoose.Schema,
Stack = require('./digserver_stack_3.js').Stack,

// will hold possible future Land model
Land,

// will hold FedLand database model
FedLand,

// fed land object
fed = {

    lockedLand : [], // current array of FedLand models that are locked
    maxLand : 3, // number of fedLand models that are up for digging
    maxPebble : 100 // the max amount of pebble to place in a $fed account
};

// randomize the composition of stackData
var randComp = function (stackData) {

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

// get fedland by id of make it if it is not there
exports.getFedLandById = function (id, scope, done) {

    scope = scope.getScope();

    FedLand.findOne({
        id : id
    }, function (err, land) {

        if (land) {

            done(land)

        } else {

            console.log('making new FedLand for id: ' + id);

            scope.pebble.createAccount('$fed', function (accountNum) {

                land = new FedLand({

                        id : id,
                        accountNum : accountNum,
                        digCount : 0,
                        stack3Data : JSON.stringify(new Stack(4, 6, 3))

                    });

                land.save(function () {

                    done(land);

                });

            });

        }

    });

};

// stock the given FedLand with pebble from the reserve account
exports.stockFedLand = function (scope, land) {

    var stockUp;

    scope = scope.getScope();

    scope.pebble.getReserve(function (reserve) {

        console.log('land.stackFedLand:');
        //console.log(reserve);

        if (reserve.wallet >= fed.maxPebble) {

            console.log('there is pebble to fill the land!');

            // get the acount of the land
            scope.pebble.getAccount(land.accountNum, function (account) {

                //console.log('this should be the account for FedLand id# ' + land.id);
                //console.log(account);

                if (account.wallet < fed.maxPebble) {

                    stockUp = fed.maxPebble - account.wallet;

                    console.log('fedLand id# ' + land.id + ' could use more pebble.');
                    console.log('the land count use a stockUp of : ' + stockUp);

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

                    console.log('fedLand id# ' + land.id + ' is stocked.');

                }

            });

            /*
            scope.pebble.transferRequest({

            // from the reserve
            from : {
            getBy : 'reserve'
            },

            // to the account of the FedLand
            to : {
            getBy : 'accountNumber',
            },

            amount : stockUp,

            fulfillerPlugin : 'land',
            fulfillerData : {},

            done : function () {

            console.log('well the transfer req was made');

            },

            fail : function () {

            console.log('land.js: some kind of fail?');

            }

            });
             */

        }

    });

};

exports.newSoloLand = function (scope, username, done, fail) {

    var stackData = new Stack({
            w : 2,
            h : 3,
            d : 2

        });

    // clear grid to standered land section object

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

    // random comp
    randComp(stackData);

    //console.log(JSON.stringify(stackData));

    if (done === undefined) {
        done = function () {};
    }
    if (fail === undefined) {
        fail = function () {};
    }

    // get the uses pluginData for 'soloLand'
    scope.users.pluginData(

        // get soloLand plugin data for the given user
        username,

        // the default object
    {

        plugin : 'soloLand',
        stack3Data : '',
        turnsLeft : 0

    },

        // done (getting pluginData)
        function (pluginData) {

        pluginData.stack3Data = JSON.stringify(stackData);
        pluginData.tunsLeft = 10;

        scope.users.updatePluginData(username, pluginData,

            // done (updaing pluginData)
            function () {

            done(pluginData);

        },

            // fail (updating pluginData)
            function () {

            fail();

        });

    },

        // fail (gettig pluginData)
        function () {

        console.log('land.js : failed getting plugin data:');

        fail();

    });

};

exports.setup = function (app, db, scope) {

    console.log('land.js : land.setup called, defining Land Collection...');

    // define the fed land collection
    FedLand = db.model('land_fed', new Schema({

                id : Number, // the id of the Fedland

                // the account number in the pebble accounts collcetion that holds pebble that is up for grabs from the Reserve
                accountNum : String,
                digCount : Number, // the number of times the land has been diged
                stack3Data : String // the stack3 state of the land

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

    /*

    Land = db.model('land', new Schema({

    forUser : String,
    turns : Number,
    stack3Data : String

    }));

     */
};
