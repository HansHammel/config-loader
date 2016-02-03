// hierarchically loads config files (json,yaml ,csv, ini) from directory trees

var path = require('path');
var fs = require('fs');
var glob = require("glob");
var merge = require('deepmerge');
var yaml = require('js-yaml');
var ini = require('ini');
var csv = require('csv-string');

function isInt(n){
    return Number(n) === n && n % 1 === 0;
}

function isFloat(n){
    return n === Number(n) && n % 1 !== 0;
}

var normalizeTypes = function(value) {
    if (typeof value === "string"){
        if (value.toLowerCase() === "true") {
            return true;
        } else if (value.toLowerCase() === "false") {
            return false;
        } else if (Number(value) !== "NaN") {
            if (isInt(value)) {
                return parse.int(value)
            } else if (isFloat(value)) {
                return parse.float(value)
            } else return value;
        } else return value;
    } else return value;
};


var traverse = require('traverse');



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
    if(!fs.existsSync(confDir)) {throw new Error('Path '+confDir+' not found');} else
    glob('**/*.conf.*', { cwd: confDir, dot: false }, function (err, _relFilePaths) {
        if (err) {
            callback(err, null);
        }
        relFilePaths = relFilePaths.concat(_relFilePaths);
        relFilePaths.forEach(function (relFilePath) {
            var fileExtension = path.extname(path.join(confDir, relFilePath));
            if (['.yaml', '.json', '.csv', '.ini', '.js'].indexOf(fileExtension) > -1) {
                //console.log('reading: ' + relFilePath);
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
                            traverse(o).forEach(function (x) {
                                this.update(normalizeTypes(x));
                            });
                            ext = ".ini";
                            break;
                        case ".csv":
                            o = csv.parse(f);
                            traverse(o).forEach(function (x) {
                                this.update(normalizeTypes(x));
                            });
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
        //console.log(process.env.NODE_ENV);
        if (process.env.NODE_ENV === 'production') result = config.production ? merge(config.production, result) : result;
        // or
        // 2. priority - development dir
        if (process.env.NODE_ENV === 'development') result = config.development ? merge(config.development, result) : result;
        // clear
        delete config.production;
        delete config.shared;
        delete config.development;
        delete config.default;
        // 1. priority - config root and other dirs
        result = merge(config, result);
        callback(null, result);
    });
};

module.exports = configLoader;