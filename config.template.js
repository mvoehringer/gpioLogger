var config = {
    channels: [
        {
            // GPIO port nummber, not the pin nummner
            gpioPort: 7, 
            // URL to log to http://HOST:PORT/middleware.php/data/CHANNELID.json
            url:  "http://localhost/middleware.php/data/fbfe8d2f-ef6b-4ea1-94d0-b9ebaec4545a.json"
        },
        // {
        //     gpioPort: 8,
        //     url:  "http://localhost/middleware.php/data/fbfe8d2f-ef6b-4ea1-94d0-b9ebaec4545b.json"
        // }
    ]
}
module.exports = config;