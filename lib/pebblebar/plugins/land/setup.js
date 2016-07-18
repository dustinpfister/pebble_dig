exports.setup = function (app, db, clientSystem, scope) {

    require('./land.js').setup(app, db, scope);

};
