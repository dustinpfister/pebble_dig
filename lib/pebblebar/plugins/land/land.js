
var mongoose = require('mongoose'), Schema = mongoose.Schema,
Stack = require('./digserver_stack_3.js').Stack,

// will hold possible future Land model
Land,

// will hold FedLand database model
FedLand,

// fed land object
fed = {

    lockedLand : [], // current array of FedLand models that are locked
    maxLand : 3 // number of fedLand models that are up for digging
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

},

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

    // create fedLand for each id if it is not there all ready
    var id = 0,
    land;
    while (id < fed.maxLand) {

        this.getFedLandById(id, scope, function (land) {

            console.log(land);

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
