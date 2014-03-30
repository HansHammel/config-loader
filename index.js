// hierarchically loads config files (json,yaml ,csv, ini) from directory trees

var path = require('path');
var fs = require('fs');
var glob = require("glob");
var merge = require('deepmerge');
var yaml = require('js-yaml');
var ini = require('ini');
var csv = require('csv-string');

function arrayToNestedObject(obj, keyPath, value) {
    lastKeyIndex = keyPath.length - 1;
    for (var i = 0; i < lastKeyIndex; ++i) {
        key = keyPath[i];
        if (!(key in obj))
            obj[key] = {};
        //obj = obj[key];
        obj = merge(obj[key], obj);
    }
    if (keyPath[lastKeyIndex] !== '.') {
        obj[keyPath[lastKeyIndex]] = value;
    }
    else {
        //obj = value;
        obj = merge(value, obj);
    }
    return obj;
}

// usage:
// var configLoader = require('configLoader');
//var config = configLoader(path.join(__dirname, 'config'), function(err, config)
//{
//    console.log(JSON.stringify(config, null, 4));
//});
var configLoader = function configLoader(confDir, callback) {
    var config = {};
    var relFilePaths = [];
    glob('**/*.conf.*', { cwd: confDir, dot: false }, function (err, _relFilePaths) {
        if (err) {
            callback(err, null);
        }
        relFilePaths = relFilePaths.concat(_relFilePaths);
        relFilePaths.forEach(function (relFilePath) {
            console.log('reading: ' + relFilePath);
            try {
                var config2 = {};
                var o;
                var f = fs.readFileSync(path.join(confDir, relFilePath), "utf8");
                switch (path.extname(path.join(confDir, relFilePath))) {
                    case ".yaml":
                        o = yaml.safeLoad(f);
                        break;
                    case ".ini":
                        o = ini.parse(f);
                        break;
                    case ".csv":
                        o = CSV.parse(f);
                        break;
                    case ".json":
                        o = JSON.parse(f);
                        break;
                    default:
                        o = {};
                }
                var folders = path.dirname(relFilePath).split('/');
                var firstElementName = path.basename(relFilePath, '.conf.yaml');
                var firstElement = { };
                firstElement[firstElementName] = o;
                config2 = arrayToNestedObject(config2, folders, firstElement);
                config = merge(config2, config);
            } catch (err) {
                console.log('ERROR: ' + err);
                //callback(err, null);
            } finally {
            }
        });
        callback(null, config);
    });
};

module.exports = configLoader;