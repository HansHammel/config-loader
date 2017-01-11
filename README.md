config-loader
=============

[![Inline docs](http://inch-ci.org/github/HansHammel/config-loader.svg?branch=master)](http://inch-ci.org/github/HansHammel/config-loader)
[![star this repo](http://githubbadges.com/star.svg?user=HansHammel&repo=config-loader&style=flat&color=fff&background=007ec6)](https://github.com/HansHammel/config-loader)
[![fork this repo](http://githubbadges.com/fork.svg?user=HansHammel&repo=config-loader&style=flat&color=fff&background=007ec6)](https://github.com/HansHammel/config-loader/fork)
[![david dependency](https://img.shields.io/david/HansHammel/config-loader.svg)](https://david-dm.org/HansHammel/config-loader)
[![david devDependency](https://img.shields.io/david/dev/HansHammel/config-loader.svg)](https://david-dm.org/HansHammel/config-loader)
[![david optionalDependency](https://img.shields.io/david/optional/HansHammel/config-loader.svg)](https://david-dm.org/HansHammel/config-loader)
[![david peerDependency](https://img.shields.io/david/peer/HansHammel/config-loader.svg)](https://david-dm.org/HansHammel/config-loader)
[![Known Vulnerabilities](https://snyk.io/test/github/HansHammel/config-loader/badge.svg)](https://snyk.io/test/github/HansHammel/config-loader)

 hierarchically loads config files (json, yaml ,csv, ini, js) from directory trees

Installation
============

	git clone git://github.com/HansHammel/config-loader.git
	npm install

or

    npm install "git+https://git@github.com/HansHammel/config-loader.git" --save

Usage
=====

```javascript
var path = require('path');
var configLoader = require('config-loader');
configLoader(path.join(__dirname, 'config'), function(err, config)
{
    console.log(JSON.stringify(config, null, 4));
});
```

**config.default**, **config.shared**, **config.production**, **config.development** are reserved (!!!) and map to the default directory structure in the following order:

    /                                   - the config root overwrites all ...
    /production and /development        - are laoded according to the `process.env.NODE_ENV` vairable and overwrite ...
    /shared                             - which overwrites  ...
    /default                            - this is where all/ full default settings should be stored and explained (the default sample configs)

config files **MUST** contain **.conf** in the filename and one of the file extensions **json**, **csv**, **ini**, **js** or **yaml**

**sample** - load all json ini csv and json files from config folder and its subdirectories

    |-config
      |-winston.conf.yaml
        |-production
          |-server.conf.json


the config can be accessed like so:

```javascript
console.log(config.winston.someSettings);
console.log(config.production.server.port);
```

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
