/*
 *    dirl_pile.js
 *    Copyight 2016 by Dustin Pfister
 *
 *    this is a client system for pebble_dig
 *
 */

var dirt = (function () {

    // basic post to server method using XMLHttpRequest
    var post = function (path, data, done) {

        // new xhr
        var http = new XMLHttpRequest();

        done = done === undefined ? function (response) {
            console.log(response)
        }
         : done;

        // open a post
        http.open('POST', path);

        //Send the proper header information along with the request
        http.setRequestHeader("Content-type", "application/json");

        // what to do on state change
        http.onreadystatechange = function () {

            if (this.readyState === 4) {

                done(JSON.parse(this.response));

            }

        };

        // send it out
        http.send(JSON.stringify(data));

        return 'sent post...';

    },

    // the control method that will be returned to dirt global
    control = function (obj) {

        if (obj === undefined) {

            post('/', {
                action : 'pebblebar'
            });

        } else {

            post('/', obj);

        }

        return 'making call to server...';

    };
	
	// request a new land stack from the server
	control.newLand = function(){
		
		this({action:'pebblebar', clientData:[{plugin:'land_newgame'}]});
		
		return 'getting new land...'
		
	},

    // geneal post to server method that can be used in the browsers JS console
    control.post = function (path, obj) {

        post(path, obj, function (response) {

            console.log(response);

        })

    },

    // logg out of pebble
    control.logout = function () {

        post('/', {
            action : 'logout'
        }, function (response) {

            // redirect to login if success
            if (response.success) {

                window.location.href = '/login';

            }

            console.log(response);

        });

        return 'peb.logout.';

    },

    // logg into pebble
    control.login = function (username, password) {

        post('/', {
            action : 'login',
            username : username,
            password : password
        }, function (response) {

            // redirect to root if success
            if (response.success) {

                window.location.href = '/';

            }

            console.log(response);

        });

        return 'peb.login';

    };

    return control;

}
    ());