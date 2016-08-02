
// exports.pluginData = function (username, defaultPluginData, done, fail) {

var dataDefault = {

    plugin : 'tax',
    system : 'flat', // the tax system in effect for the user
    total : 0, // total amount of tax that needs to be payed
    cap : 100 // the max amount of pebble the user can be in debt

},

systems = {

    flat : {

        cap : 100,

        getRate : function () {

            return .05;

        }

    },

    exempt : {

        cap : 0,

        getRate : function () {

            return 0;

        }

    }

};

// logg income for the given user
exports.income = function (username, scope, amount) {

    scope.users.pluginData(username, dataDefault, function (plugin) {

        // get rate
        var rate = systems[plugin.system].getRate(),
        tax = Math.floor(amount * rate);

        // set cap
        plugin.cap = systems[plugin.system].cap;

        // if we have not reached the cap yet...
        if (plugin.total < plugin.cap) {

            // if tax + total is less then the cap...
            if (tax + plugin.total < plugin.cap) {

                // just add tax to total
                plugin.total += tax;

            // else top it off.
            } else {

                plugin.total = plugin.cap;

            }

        }

        scope.users.updatePluginData(username, plugin);

    });

};
