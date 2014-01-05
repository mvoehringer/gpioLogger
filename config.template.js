var config = {
    channels: [
        {
            // GPIO port nummber, not the pin nummner
            gpioPort: 7, 
            // URL to log to http://HOST:PORT/middleware.php/data/CHANNELID.json
            url:  "http://localhost/middleware.php/data/fbfe8d2f-ef6b-4ea1-94d0-b9ebaec4545a.json",
            // interval in seconds to wirte the values to the middleware 
            interval: 15
        },
        // {
        //     gpioPort: 8,
        //     // URL to log to http://HOST:PORT/middleware.php/data/CHANNELID.json
        //     url:  "http://localhost/middleware.php/data/fbfe8d2f-ef6b-4ea1-94d0-b9ebaec4545b.json"
        //     // interval in seconds to wirte the values to the middleware 
        //     interval: 5
        // }
    ]
}
module.exports = config;