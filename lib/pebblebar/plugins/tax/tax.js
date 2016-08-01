
// exports.pluginData = function (username, defaultPluginData, done, fail) {

var dataDefault = {

    plugin : 'tax',
    total : 0 // total amount of tax that needs to be payed

};

// logg income for the given user
exports.income = function (username, scope, amount) {

    scope.users.pluginData(username, dataDefault, function (plugin) {

        plugin.total += amount;

        scope.users.updatePluginData(username, plugin);

    });

};
