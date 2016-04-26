"use strict";

var path = require('path');
var conf = require(path.join(__dirname, "/conf"));
var tspdt = require(path.join(__dirname, "/parsers/tspdt"));
var imdb = require(path.join(__dirname, "/apis/imdb"));

if (!conf) {
    console.log("Failed to get config data");
    process.exit(-1);
}

var links = conf.tspdt;

for (let iter in links) {
    if (!links[iter]) {
        continue;
    }
    var cb = function (err, movies) {
        if (err) {
            console.log(err);
        } else {
            imdb.search(movies);
        }
    };
    tspdt.parse(links[iter], cb);

}