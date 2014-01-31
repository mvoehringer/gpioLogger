gpioLogger
==========
Daemon to read **impulses** or **1-wire** sensors on GPIO ports of an RespberryPI and send the result to the **volkszaehler.org** middle-ware.

## Features ##
 * Non blocking IO (thanks to NodeJs) - the daemon will not miss signals, while sending to the middle-ware 
 * You can configure how often you want to send results to the middle-ware
 * supports impulse sensors and 1-wire sensors
 * For Impulse inputs
   * You don't need special io-board to count S0 like sensors, because you can connect them directly to your GPIO port. If you sensors work with a voltage different to 3.3V you can't connect them to the RaspberryPI without an extra circuit! 
   * You can configure an software debounce timeout per channel
   * Configure the edge to watch for (rising, falling or both)
 * For 1-wire sensors
   * You can connect the sensors to the GPIO port without an extra 1-wire busmaster chip 

## Example set-up ##
This is an very basic example with an push button as sensor. In the real world you would replace the button with a sensor of your choice. 

![bush button example](https://raw.github.com/mvoehringer/gpioLogger/master/example/pushbutton.png)

## Install ##
### Install latest version of nodejs ###
  * `wget http://nodejs.org/dist/v0.10.22/node-v0.10.22-linux-arm-pi.tar.gz`
  * `tar xvzf node-v0.10.22-linux-arm-pi.tar.gz`
  * `sudo mkdir /opt/node`
  * `sudo cp -r node-v0.10.22-linux-arm-pi/* /opt/node`
  * `sudo nano /etc/profile` and replace ```export PATH``` with

```
NODE_JS_HOME="/opt/node"
PATH="$PATH:$NODE_JS_HOME/bin"
export PATH
```

### Install gpio-admin ###
 install quick2wire-gpio-admin https://github.com/quick2wire/quick2wire-gpio-admin
 * `git clone https://github.com/quick2wire/quick2wire-gpio-admin.git` 
 * `cd quick2wire-gpio-admin`
 * `make`
 * `sudo make install`

### Install gpioLogger ###
 * `cd /opt/`
 * `sudo git clone https://github.com/mvoehringer/gpioLogger.git`
 * `cd /opt/gpioLogger`
 * `sudo npm config set registry http://registry.npmjs.org/
 * `sudo npm install`
 * create you config.js file by copying the config.template.js file. `cp config.template.js config.js`
 * edit the config.js file
 * now you can start `./gpioLogger.js` and try if everything works as expected.

#### Configure impulse inputs ####

 ```js
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
                gpioPort: 17, 
            }
        }
    ]
}
module.exports = config;
 ```

#### Configure 1 wire sensor DS1820 input ####
* At the moment, only DS1820 sensors are supported, maybe other sensors will also work, but i only have the DS1820 for testing
* all sensors have to me connected to GPIO4, this is a limitation of the w1-gpio kernel module and will hopefully be changed in the future
* try to load the kernel modules 
```sh
sudo modprobe w1-gpio pullup=1
sudo modprobe w1-therm
```
* if you want to load the modules at reboot, add two lines to /etc/modules
```
w1-gpio pullup=1
w1-therm
```
* Configure config.js
 ```js
 var config = {
    channels: [
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
                ignore: [ 85.00, ],

                // at the moment only 'DS18S20' tempature sensors are supported
                type: 'DS18S20'
            }
        }
    ]
}
module.exports = config;
 ```


### Autostart gpioLogger ###
 * `sudo useradd -m -G gpio gpiologger`
 * copy init script to startup gpioLogger after reboot `sudo cp -a debian/gpiologger.sh /etc/init.d/gpiologger`
 * create folder for logfiles `sudo mkdir /var/log/gpiologger`
 * `sudo chown gpiologger: /var/log/gpiologger`
 * `sudo /opt/node/bin/npm install forever -g`
 * `sudo update-rc.d gpiologger defaults`


### Troubleshooting  ###
 * The best way to monitor you setup is to start the gpioLogger daemon via the command line. 
   -  make sure the gpiologger is not running ```sudo /etc/init.d/gpiologger stop```
   -  ```cd /opt/gpiologger```
   -  ```./gpiologger.js``
   -  Now you should see messages as soon as the gpiologger receives the first data

 * If you see errors like this, you have permissions problems!
```
fs.js:427
  return binding.open(pathModule._makeLong(path), stringToFlags(flags), mode);
                 ^
Error: EACCES, permission denied '/sys/class/gpio/gpio5/direction'
```
To solve this, pleas see https://github.com/fivdi/onoff for more infos.