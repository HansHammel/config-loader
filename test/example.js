var path = require('path');
var configLoader = require('../index.js');
configLoader(path.join(__dirname, 'fixture', 'conf'), function(err, config)
{
    if(err) console.log(err);
    console.log(JSON.stringify(config, null, 4));
});
