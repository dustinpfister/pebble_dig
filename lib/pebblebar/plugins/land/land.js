
var mongoose = require('mongoose'), Schema = mongoose.Schema,
Stack = require('./stack_3.js').Stack,
Land;

exports.newSoloLand = function (scope, username, done, fail) {

    var stackData = new Stack({
            w : 2,
            h : 3,
            d : 2

        });

    stackData.clearGrid();

    if (done === undefined) { done = function () {}; }
    if (fail === undefined) { fail = function () {}; }

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

                    console.log('looks like we made it! check it: ');
                    console.log(pluginData);

                    done(pluginData);

                },

                // fail (updating pluginData)
                function () {

                    fail();

                }

            );

        },

        // fail (gettig pluginData)
        function () {

            console.log('land.js : failed getting plugin data:');

            fail();

        }

    );

};

exports.setup = function (db) {

    console.log('land.js : land.setup called, defining Land Collection...');

    Land = db.model('land', new Schema({

                forUser : String,
                turns : Number,
                stack3Data : String

            }));

};
