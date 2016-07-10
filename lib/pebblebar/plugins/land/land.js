
var mongoose = require('mongoose'), Schema = mongoose.Schema,
Stack = require('./stack_3.js').Stack,
Land;

exports.newSoloLand = function (scope, username) {

    var stackData = new Stack({
            w : 4,
            h : 6,
            d : 3

        });

    stackData.clearGrid();

    console.log('land.js : newLand method called.');
    console.log(stackData);

    // get the plugin data for land
    //exports.pluginData = function (username, defaultPluginData, done, fail) {

    scope.users.pluginData(

        // get soloLand plugin data for the given user
        username,

        // the default object
    {

        plugin : 'soloLand',
        stack3Data : '',
        turnsLeft : 0

    },

        // done
        function (pluginData) {

        console.log('so far so g-g-g-good.');
        console.log(pluginData);

    },

        // fail
        function () {

        console.log('land.js : failed getting plugin data:');

    });

};

exports.setup = function (db) {

    console.log('land.js : land.setup called, defining Land Collection...');

    Land = db.model('land', new Schema({

                forUser : String,
                turns : Number,
                stack3Data : String

            }));

};
