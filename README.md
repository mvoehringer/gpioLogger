gpioLog
==========
Deamon to write GPIO ports changes on an respberryPI to the volkszaehler.org middle-ware. This will work very similar to https://github.com/w3llschmidt/s0vz.

Install
--------
 * `sudo apt-get install nodejs npm`
 * `cd /opt/`
 * `sudo git clone https://github.com/mvoehringer/gpioLog.git`
 * `cd /opt/gpioLog`
 * `npm install`
 * create you config.js file by copying the config.template.js file. `cp config.template.js config.template.js`
 * edit the config.js file
 * `sudo chmod +x gpioLog`
 * Every time you make changes in the config.js, you should start gpioLog as root. `sudo /path/to/node gpioLog`
 * now you can start `./gpioLog` and try if everything works as expected.

 Coming Soon: 
  * How to autostart the daemon process 


If you see errors like this, you have permissions problems.
```
fs.js:427
  return binding.open(pathModule._makeLong(path), stringToFlags(flags), mode);
                 ^
Error: EACCES, permission denied '/sys/class/gpio/gpio5/direction'
```
To solve this, pleas see https://github.com/fivdi/onoff for more infos.