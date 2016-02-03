var path = require('path');
var fs = require('fs');
var chai = require('chai');
//var chaiHttp = require('chai-http');
//var assert = require('chai').assert;
//var should = chai.should();
//var assert = require('assert');
//var should = require('should');
var expect = chai.expect;
//chai.use(chaiHttp);
/*
 it('should list ALL blobs on /blobs GET', function(done) {
 chai.request(server)
 .get('/blobs')
 .end(function(err, res){
 res.should.have.status(200);
 done();
 });
 });
 */


//noinspection JSUnresolvedFunction
describe('config-loader.js', function () {
    //noinspection JSUnresolvedFunction
    describe('.configLoader(confDir, callback)', function () {
        this.slow('1s');
        it('should load valid config', function (done) {
            var configLoader = require('../index.js');
            configLoader(path.join(__dirname, 'fixture', 'conf'), function (err, config) {
                if (err) done(err);
                var reference = {
                    "you": {
                        "too": {
                            "some": "value",
                            "string": "string",
                            "number": 10,
                            "boolean": false
                        }
                    },
                    "so": {
                        "old": [
                            [
                                "a",
                                "good",
                                "day",
                                "to",
                                "die",
                                ""
                            ],
                            [
                                "maybe",
                                "no",
                                "good",
                                "idea",
                                "0",
                                true
                            ]
                        ]
                    },
                    "me": {
                        "plenty": {
                            "test": {
                                "the": {
                                    "best": "coffee"
                                }
                            },
                            "string": "string",
                            "number": 10,
                            "boolean": false
                        }
                    },
                    "irmation": {
                        "nothing": [
                            "to",
                            "see",
                            "here"
                        ],
                        "except": {
                            "this": true,
                            "string": "string",
                            "number": 10,
                            "boolean": false
                        }
                    },
                    "ig": {
                        "light": {
                            "switch": "off"
                        },
                        "drivers": {
                            "wave": "mmdrv.dll",
                            "timer": "timer.drv"
                        },
                        "bullshit": {
                            "cow": "willy",
                            "string": "string",
                            "swing": "swing",
                            "number": "10",
                            "boolean": false
                        }
                    }
                };
                expect(JSON.stringify(config)).to.equal(JSON.stringify(reference));
                expect(config).to.deep.equal(reference);
                done();
            });
        })
    })
});