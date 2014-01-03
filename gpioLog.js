#!/usr/bin/env node
'use strict';

var request = require('request'),
    config = require('./config'),
    Gpio = require('onoff').Gpio;

config.channels.forEach(function(channel){
    var port = new Gpio(channel.gpioPort, 'in', 'both');
    var pulseCounter = 0;
    console.log('listening on GPIO port: ' + channel.gpioPort);
    
    // watch for changes on GPIO port
    port.watch(function(err, value) {
        if (err) {
          console.error(err);
        }
        if(value){
          pulseCounter ++;
          console.log("pulse found on: " +  channel.gpioPort + " count: " + pulseCounter);
        }
    });
    
    // send counter to the middleware
    setInterval(function(){
        if(pulseCounter){
            // save counter to restore the count if something went wrong
            var pulseMemory = pulseCounter;
            pulseCounter = 0;
    
            request.post(
                channel.url,
                { form: { value: pulseMemory } },
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        console.log("pulse saved: " + pulseMemory);
                    }else{
                        console.error("cound not transmit data to middleware");
                        console.error(error);
                        pulseCounter += pulseMemory;
                    }
                }
            );
        }
    },  parseInt(channel.interval) * 1000);    // write every x seconds to middleware
});

console.log("ready..");

