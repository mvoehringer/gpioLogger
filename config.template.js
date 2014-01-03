var config = {
    channels: [
        {
            // GPIO port nummber, not the pin nummner
            gpioPort: 7, 
            // URL to log to http://HOST:PORT/middleware.php/data/CHANNELID/
            url:  "http://192.168.1.102:3000/data/fbfe8d2f-ef6b-4ea1-94d0-b9ebaec4545a/"
        },
        {
            gpioPort: 8,
            url:  "http://192.168.1.102:3000/data/fbfe8d2f-ef6b-4ea1-94d0-b9ebaec4545a/"
        }
    ]
}
module.exports = config;