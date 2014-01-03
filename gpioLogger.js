var request = require('request'),
    config = require('./config'),
    Gpio = require('onoff').Gpio;

config.channels.forEach(function(channel){
    var port = new Gpio(channel.gpioPort, 'in', 'both');
    var pulseCounter = 0;
    console.log('listening on GPIO port: ' + channel.gpioPort);
    port.watch(function(err, value) {
        if (err) {
          console.error(err);
        }
        if(value){
          pulseCounter ++;
          console.log("pulse found on: " +  channel.gpioPort + " count: " + pulseCounter);
        }
    });
    
    setInterval(function(){
        if(pulseCounter){
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

