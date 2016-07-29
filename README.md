# Pebble_dig

    please note: As of this writing this readme reflects version 1.7.15

Pebble_dig is the fist game based off of my platform "pebble" ( forked from version 1.0.434 ), and prototypes of mine that I developed simply called "dig", and "stack_3". It is a game where there is a finite amount of a currency called "pebble" that is found in the land parcels of the pebble world government (solo game), and that of other players (pvp). It is a project where I aim to help with understanding what needs to change with my platform, and hopefully result in a somewhat fun game in the process.

# getting started

After setting up an account and logging in, choose to play a solo or pvp game. When you dig land points at a parcel you may find a little pebble, keep digging until you run out of digs, at which point the land state will be transmitted to the server. If everything checks out okay, the amount of pebble you found will be credited from the land you dug at to your own land.

As of this writing ( 1.7.x ) this is basically the depth of the game.

# egg object ( cheating )

If you open a javascript console (ctr + shift + j in chrome) the egg object should exist if using the jboot client system ( /?cs=jboot query string). This object reflects the current state of what has been defeated, and what might be somewhat useful when it comes to hacking, and automating the game.

    egg.westSide();

The westSide method will always use latest method in the egg object that may or may not be effective at defeating server side sanitation (as of 1.7.15 it is not). westSide works by calling a dig method, then calling egg.submitNow to submit the dug stack to the server, and finally it sets the application machine  state to 'title'. Before sanitation was in place it was effective at crediting all off the pebble in the land account to the player at each call. In the future westSide will likely work, but in a very believable way, that conforms to server side sanitation rules.

As of 1.7.x server side sanitation of submitted stack3Data is in place, and the following methods no longer work:

    egg.digAll();

this was the first method that I used that just simply dug out all the land points in the stack, it was defeated with my first check method.

    egg.targetedDigs();

this methods would work by selectively digging valuable points from the bottom up (the most valuable points are at the bottom). It would also do so up to the total amount of digs allowed on the land, thus defeating the first sanitation check. It was defeated by the next check that looks to see if digs happen from the surface down.

    egg.supperPoint();

supperPoint worked by simply setting the pebble amount of a single point on the surface ( point (0,0,0) ) to a value that equals the total amount of pebble in the stack. This would defeat both sanitation checks in place as no comparisons where being made between what is being submitted and what exists on the server. It was defeated after writing an additional two checks that do just that.

# future of egg object

as of this writing I intend to do additional work on the egg object to allow for believable cheating, automation, some kind of backdoor maybe, as well as any other goodies that can be considered an 'Easter egg'.
