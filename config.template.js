var config = {
    channels: [
        {
            // URL to log to http://HOST:PORT/middleware.php/data/CHANNELID.json
            url:  "http://localhost/middleware.php/data/fbfe8d2f-ef6b-4ea1-94d0-b9ebaec4545a.json",
            
            // interval in seconds to wirte the values to the middleware 
            interval: 15,
            
            impulse : {
                //   The pulse generating edge: 'rising', 'falling' or 'both'.
                edge: 'rising',

                // software debounce a button or switch using a timeout. Specified in milliseconds
                debounceTimeout: 0, 

                // GPIO port nummber, not the pin nummner
                gpioPort: 17
            }
        },
        {
            // to activate 1wire sensors, connect you sensor to GPIO4 and activate the 1wire kernel  
            // modules, see https://github.com/mvoehringer/gpioLogger for more infos

            // URL to log to http://HOST:PORT/middleware.php/data/CHANNELID.json
            url:  "http://localhost/middleware.php/data/fbfe8d2f-ef6b-4ea1-94d0-b9ebaec4545b.json",
            
            // interval in seconds to wirte the values to the middleware 
            interval: 15,
            
            oneWire : {
                // sensor device numnber, you can finde the numner by enter
                // ls /sys/bus/w1/devices/
                // on the command line
                device: '10-000802b47b33',

                // ignore values
                // sometimes sensores will return unwanted values for example while initial
                ignore: [ 85.00 ],

                // at the moment only 'DS18S20' tempature sensors are supported
                type: 'DS18S20'
            }
        }    
        // {
        //     gpioPort: 8,
        //     // URL to log to http://HOST:PORT/middleware.php/data/CHANNELID.json
        //     url:  "http://localhost/middleware.php/data/fbfe8d2f-ef6b-4ea1-94d0-b9ebaec4545b.json"
        //     // interval in seconds to wirte the values to the middleware 
        //     interval: 5
        //     // The pulse generating edge: 'rising', 'falling' or 'both'.
        //     edge: 'rising',
        //     // software debounce a button or switch using a timeout. Specified in milliseconds
        //     debounceTimeout: 0 
        // }
    ]
};

module.exports = config;