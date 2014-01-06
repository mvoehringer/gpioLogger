gpioLogger
==========
Daemon to read GPIO ports of an RespberryPI and to post the count to the volkszaehler.org middle-ware. This will work very similar to https://github.com/w3llschmidt/s0vz and https://github.com/volkszaehler/vzlogger 

## Features ##
 * Non blocking IO (thanks to NodeJs) - the deamon will not miss signals, while sending to the middle-ware 
 * You can configure how often you want to send results to the middle-ware
 * You don't need special io-board to count S0 like sensors, because you can connect them directly to you GPIO port
 * You can configure an software debounce timeout per channel
 * Configure the edge to watch for (rising, falling or both)

## Install ##
### Install actual version of nodejs ###
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

### Autostart gpioLogger ###
 * `sudo useradd -m -G gpio gpiologger`
 * copy init script to startup gpioLogger after reboot `sudo cp -a debian/gpiologger.init /etc/init.d/gpiologger`
 * create folder for logfiles `sudo mkdir /var/log/gpiologger`
 * `sudo chown gpiologger: /var/log/gpiologger`
 * `sudo /opt/node/bin/npm install forever -g`
 * `sudo update-rc.d gpiologger defaults`

## Coming Soon ##
 * example setup how to read a sensor

### Troubleshooting  ###
If you see errors like this, you have permissions problems!
```
fs.js:427
  return binding.open(pathModule._makeLong(path), stringToFlags(flags), mode);
                 ^
Error: EACCES, permission denied '/sys/class/gpio/gpio5/direction'
```
To solve this, pleas see https://github.com/fivdi/onoff for more infos.