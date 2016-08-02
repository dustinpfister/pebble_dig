
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

exports.payTax = function (username, scope, loot) {

    var payment = 0;

    scope.users.pluginData(username, dataDefault, function (plugin) {

        console.log('tax.js payTax: total: ' + plugin.total);

        if (loot < plugin.total) {

            payment = Math.floor(loot * 0.8);

        } else {

            payment = Math.floor(plugin.total * 0.2);

        }
		
		console.log('tax.js payment: ' + payment);
		
		scope.pebble.transferRequest({

            from : {
                getBy : 'username',
                username : username
            },
            to : {
                getBy : 'reserve'
            },
            amount : payment,
            //fulfillerPlugin : 'land_submit',
            //fulfillerData : {
            //    landId : landId,
            //    toName : username
            //},

            done : function () {},

            fail : function () {}

        });

    });

};
