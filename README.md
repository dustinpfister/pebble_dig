# Pebble_dig

    please note: As of this writing this readme reflects version 1.0.117

Pebble_dig is the fist game based off of my platform "pebble" ( forked from version 1.0.434 ), and prototypes of mine that I developed simply called "dig", and "stack_3". As of this writing the basic idea of the game is functional.

# geting started

After setting up and account logg in and just start clicking or pressing points in what I am currently calling a FedLand land stack. The FedLand will always be there as a way to get things started when all the worlds pebble is in "The Reserve Account". After running out of digs, if you find some pebble it will be credited to your pebble account. For now you have to hit f5 (or do whatever to reload) to start again.

# cheating

becuase I have not yet implamented adaquite server side sanatation, there are many ways to cheat. Please be warned that in the future these cheats will likly be patched, but for now have fun.

In chrome open up the web dev tools by pressing ctrl + shift + j, make sure you are in the console, and try one of the following.

## changing the number of digs client side:

    type: cs.digs=30

That will give yourself 30 digs, or as many as you like. As long as I am not checking the count of emptys you can dig the whole land stack.

## seting the pebble value of any point in the stack to any value you want

    type: stack.getPoint(1,2,0).val.amount=100;

This will set the pebble amount of the point (1,2,0) to 100 pebbles, where x=1,y=2, and z=0 (the first surface layer). As long as the amount that you win falls short or equal to the total amount of pebble in the acount assated with the land tial, the transfer should go threw. (this one realy needs to be pached ;) )

## take a look at the stack

    type:  console.log( stack.getPoint(0,0,0).va )

To take a look at what the deal is with that point before you even start diging.

Thats it for cheating, for now at least. Even when these things are patched I will likley throw in a few pointers as to what can still be done.