var scope = require('./scope.js').getScope();

// process a response for a clientData array
processResponse = function (plug, responseArray, req, res, scope, done) {

    if (req.body.clientData.length > 0) {

        if (plug < req.body.clientData.length) {

            scope.pebble.getReserve(function (reserve) {

                var i = 0,
                len = reserve.responders.length,
                plugActive = false;
                while (i < len) {

                    if (req.body.clientData[plug].plugin === reserve.responders[i]) {

                        plugActive = true;
                        break;

                    }

                    i++;
                }

                if (plugActive) {

                    require('./plugins/' + req.body.clientData[plug].plugin + '/responder.js').createAppResponse(
                        req.body.clientData[plug], req, res, scope, function (response) {

                        responseArray.push(response)

                        plug += 1;
                        processResponse(plug, responseArray, req, res, scope, done);

                    });

                } else {

                    responseArray.push({

                        plugin : req.body.clientData[plug].plugin,
                        mess : 'plugin inactive, or unkown plugin!'

                    });

                    plug += 1;
                    processResponse(plug, responseArray, req, res, scope, done);

                }

            })

        } else {

            done({

                mess : 'okay here is your response object',
                response : responseArray

            });

        }

    } else {

        done({

            mess : 'this is processResponse, but looks like we have an empty app array'

        });

    }

};

//exports.post = function (req, res, users, pebble, notPebblebar) {
exports.post = function (req, res, notPebblebar) {

    // we should have and action.
    if (req.body.action) {

        // is the action a pebblebar post?
        if (req.body.action === 'pebblebar') {

            // do we have client data?
            if (req.body.clientData) {

                // is client data an object?
                if (typeof req.body.clientData === 'object') {

                    // is the constructor of clientData array?
                    if (req.body.clientData.constructor.name === 'Array') {

                        processResponse(0, [], req, res, scope, function (response) {

                            // logout use of pebblebar
                            if (!req.user) {

                                res.send(response);

                                // else logged in
                            } else {

                                scope.users.getUserSafe(req.user.username, function (user) {

                                    response.userData = user;

                                    res.send(response);

                                });

                            }

                        });

                        // okay so we have an object
                    } else {

                        scope.users.getUserSafe(req.user.username, function (user) {

                            res.send({
                                mess : 'clientData should be an array.',
                                userData : user
                            });

                        });

                    }

                } else {

                    //users.getUserSafe(req.user.username, function (user) {
                    scope.users.getUserSafe(req.user.username, function (user) {

                        // just send standard response
                        res.send(JSON.stringify({

                                mess : 'why is client data not an object?',
                                userData : user

                            }));

                    });

                }

                // if no clientData
            } else {

                scope.users.getUserSafe(req.user.username, function (user) {

                    // just send standard response
                    res.send(JSON.stringify({

                            userData : user

                        }));

                });

            }

            // if not pebblebar
        } else {

            // no nothing
            notPebblebar();

        }

    } else {

        // do nothing
        notPebblebar();
    }

};
