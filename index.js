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

var config = {};
var relFilePaths = [];

// usage:
// var configLoader = require('configLoader');
//var config = configLoader(path.join(__dirname, 'config'), function(err, config)
//{
//    console.log(JSON.stringify(config, null, 4));
//});
var configLoader = function configLoader(confDir, callback) {
    glob('**/*.conf.*', { cwd: confDir, dot: false }, function (err, _relFilePaths) {
        if (err) {
            callback(err, null);
        }
        relFilePaths = relFilePaths.concat(_relFilePaths);
        relFilePaths.forEach(function (relFilePath) {
            var fileExtension = path.extname(path.join(confDir, relFilePath));
            if (['.yaml', '.json', '.csv', '.ini', '.js'].indexOf(fileExtension) > -1) {
                console.log('reading: ' + relFilePath);
                try {
                    var config2 = {};
                    var o;
                    var ext;
                    var p = path.join(confDir, relFilePath);
                    var f = fs.readFileSync(p, "utf8");
                    switch (fileExtension) {
                        case ".yaml":
                            o = yaml.safeLoad(f);
                            ext = ".yaml";
                            break;
                        case ".ini":
                            o = ini.parse(f);
                            ext = ".ini";
                            break;
                        case ".csv":
                            o = CSV.parse(f);
                            ext = ".csv";
                            break;
                        case ".json":
                            o = JSON.parse(f);
                            ext = ".json";
                            break;
                        case ".js":
                            o = require(p);
                            ext = ".js";
                            break;
                        default:
                            o = {};
                            ext = "";
                    }
                    var folders = path.dirname(relFilePath).split('/');
                    var firstElementName = path.basename(relFilePath, '.conf' + ext);
                    var firstElement = { };
                    firstElement[firstElementName] = o;
                    config2 = arrayToNestedObject(config2, folders, firstElement);
                    config = merge(config2, config);
                } catch (err) {
                    console.log('ERROR: ' + err);
                    //callback(err, null);
                } finally {
                }
            }
        });
        //remap object according to priorities

        var result = {};
        // 4. priority - default dir
        result = config.default ? merge(config.default, result) : result;
        // 3. priority - shared dir
        result = config.shared ? merge(config.shared, result) : result;
        // 2. priority - production dir
        result = process.env.NODE_ENV == 'procudtion' ? (config.production ? merge(config.production, result) : result) : result;
        // or
        // 2. priority - development dir
        result = process.env.NODE_ENV == 'development' ? (config.development ? merge(config.development, result) : result) : result;
        // clear
        config.production = undefined;
        config.shared = undefined;
        config.development = undefined;
        config.default = undefined;
        // 1. priority - config root and other dirs
        result = merge(config, result);
        callback(null, result);
    });
};

module.exports = configLoader;