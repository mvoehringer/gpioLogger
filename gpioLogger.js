#!/usr/bin/env node
'use strict';

var request = require('request'),
    fs = require('fs'),
    config = require('./config'),
    Gpio = require('onoff').Gpio;

Array.prototype.hasValue = function(value) {
  var i;
  for (i=0; i<this.length; i++) { if (this[i] === value) return true; }
  return false;
}

function readImpuls(channel){
    var debounceTimeout = channel.impulse.debounceTimeout || 0,
        edge   = channel.impulse.edge || 'rising';

    // Open Gpio port 
    var port = new Gpio(channel.impulse.gpioPort, 'in', edge, {debounceTimeout: debounceTimeout});

    // buffer for pulse
    var pulseCounter = 0;

    console.log('listening on GPIO port: ' + channel.impulse.gpioPort);
    
    // watch for changes on GPIO port, only chnages from 0 -> 1 will increase the counter
    port.watch(function(err, value) {
        if (err) {
          console.error(err);
        }
        
        pulseCounter ++;
        console.log("pulse found on: " +  channel.impulse.gpioPort + " count: " + pulseCounter);
    });
    
    // send counter to the middleware
    setInterval(function(){
        if(pulseCounter){
            // save counter to restore the count if something went wrong
            var pulseMemory = pulseCounter;
            pulseCounter = 0;
            
            // send data 
            request.post(
                channel.url,
                { form: { value: pulseMemory } },
                function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        console.log("pulse saved: " + pulseMemory);
                    }else{
                        console.error("Error while sending data. error:" +  error  + " Respone: " + response.statusCode);
                        pulseCounter += pulseMemory;
                    }
                }
            );
        }
    },  parseInt(channel.interval) * 1000);    // write every x seconds to middleware
}

function readOneWire(channel){

    setInterval(function(){

        
        fs.readFile('/sys/bus/w1/devices/' +  channel.oneWire.device + 'w1_slave' , function (err, data) {
            var sensorValue = null;

            if (err){
                console.error(err);
                throw err;
            }
            
            // Parse data, read tempature
            sensorValue = function (data){
                console.log(data.indexOf("t="));
                console.log(data);
            }

            // sensorValue found and not in ignore list
            if(sensorValue !== null && !channel.oneWire.ignore.hasValue(sensorValue)){
                // send data 
                request.post(
                    channel.url,
                    { form: { value: sensorValue } },
                    function (error, response, body) {
                        if (!error && response.statusCode == 200) {
                            console.log("sensor data saved: " + sensorValue);
                        }else{
                            console.error("Error while sending data. error:" +  error  + " Respone: " + response.statusCode);
                        }
                    }
                );                
            }
            
        });
        
    },  parseInt(channel.interval) * 1000);    // write every x seconds to middleware

}

config.channels.forEach(function(channel){
    if(channel.impulse){
        readImpuls(channel);
    }else if(channel.oneWire){
        readOneWire(channel);
    }else{
        console.error('Configuration error, no channel type found.');
    }
});

console.log("ready..");

