exports.setup = function (app, db, clientSystem, scope) {

    console.log('setup.js (land plugin): setup method called.');

    require('./land.js').setup(app, db, scope);

};
