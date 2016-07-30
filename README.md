# Pebble_dig

    please note: this readme reflects v1.7.15

Pebble_dig is the fist game based off of my platform "pebble" ( forked from version 1.0.434 ), and prototypes of mine that I developed simply called "dig", and "stack_3". It is a game where there is a finite amount of a currency called "pebble" that is found in the land parcels of the pebble world government (solo game), and that of other players (pvp). It is a project where I aim to help with understanding what needs to change with my platform, and hopefully result in a somewhat fun game in the process.

# getting started

After setting up an account and logging in, choose to play a solo or pvp game. When you dig land points at a parcel you may find a little pebble, keep digging until you run out of digs, at which point the land state will be transmitted to the server. If everything checks out okay, the amount of pebble you found will be credited from the land you dug at to your own land.

As of this writing ( 1.8.x ) this is basically the depth of the game itself from an end users perspective.


# egg object ( cheating, and game automation )

If you open a javascript console (ctr + shift + j in chrome) the egg object should exist if using the jboot client system ( /?cs=jboot query string). This object reflects the current state of what has been defeated, and what might be somewhat useful when it comes to hacking, and automating the game.

    egg.westSide();

The westSide method will always use latest method in the egg object that may or may not be effective at defeating server side sanitation (as of 1.8.x it is via the autoDig dig method (default).). westSide works by calling a dig method, then calling egg.submitNow to submit the dug stack to the server, and finally it sets the application machine  state to 'title'. westSide will likely always work, but it might only work in a very believable way, that conforms to server side sanitation rules.

As of 1.7.x basic server side sanitation of submitted stack3Data is in place, and the following methods no longer work:

    egg.westSide('digAll');

This was the first method that I used that just simply dug out all the land points in the stack, it was defeated with my first check method.

    egg.westSide('targetedDigs');

This methods would work by selectively digging valuable points from the bottom up (the most valuable points are at the bottom). It would also do so up to the total amount of digs allowed on the land, thus defeating the first sanitation check. It was defeated by the next check that looks to see if digs happen from the surface down.

    egg.westSide('supperPoint');

supperPoint worked by simply setting the pebble amount of a single point on the surface ( point (0,0,0) ) to a value that equals the total amount of pebble in the stack. This would defeat both sanitation checks in place as no comparisons where being made between what is being submitted and what exists on the server. It was defeated after writing an additional two checks that do just that.

as of 1.8.x the following method works

    egg.westSide('autoDig');

The autoDig method was added in 1.8.x to be used in client side game automation. It works by digging down from the surface down to the bottom of the stack, and at each layer digs the most valuable point found. Once it hits the bottom of the stack if it has remaining digs, it will then dig points from the bottom back up until it runs out of digs. As such autoDig will always automatically dig the stack in a way that will gain the maximum amount of pebble up to the max amount of digs allowed in the land, in a very player like way.

# Game Automation

##To automate the game type the following in the console.

    egg.autoPlay();

This will automatically play a pvp game with the autoDig dig method, and submit the stack data to the server. After 1 second has elapsed sense the the server response is received, another game will start.

## egg.autoPlay options

    egg.autoPlay({playTime: 3000, type: 'fed', method: 'digAll'})

The above is an example of other options you can pass to egg.autoPay. It does not make sense to use any other method other then the default autoDig for the moment, but you may want to slow or speed up the process, and dig at fed land for a change.

## Stoping Automation;

    egg.killAuto();

Use egg.killAuto to stop automation of the game without reloading the browser.

# future of cheating and automation:

    defeating game automation

So far one way to defeat the autoDig method is to make changes that will allow to compare the number of digs to the composition of points (autoDig does not make any distinction of digPoint values). Another idea is to have some kind of suspicion ranking that will get high if a player seems to always dig where pebble is. Yet another option is to limit the number of games that the user can play over a certain amount of time that will at least help to reduce the volume.
