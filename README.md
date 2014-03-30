config-loader
=============

 hierarchically loads config files (json, yaml ,csv, ini, js) from directory trees

Installation
============

	git clone git://github.com/HansHammel/config-loader.git
	npm install

or

    npm install "git+https://git@github.com/HansHammel/config-loader.git" --save

Usage
=====

config files MUST contain a **.conf** in the filename and one of the file extensions **json**, **csv**, **ini**, **js** or **yaml**
Load all json ini csv and json files from config folder and its subdirectories

    |-config
      |-winston**.conf.yaml**
        |-production
          |-server**.conf.json**

```javascript
var configLoader = require('config-loader');
var config = configLoader(path.join(__dirname, 'config'), function(err, config)
{
    console.log(JSON.stringify(config, null, 4));
});
```

Config can be accessed like so:
**config.winston.**someSettings
**config.production.server.**port
etc.

.conf.js Sample

```javascript
var config = {}
config.twitter = {};
config.twitter.user_name = process.env.TWITTER_USER || 'username';
config.twitter.password=  process.env.TWITTER_PASSWORD || 'password';
module.exports = config;
```

.conf.yaml Sample
```yaml
server:
  port: 3000
database:
  host: 'localhost'
  port: 27017
```
