"use strict";

var fs = require("fs");
var path = require('path');

var obj = null;
try {
    obj = JSON.parse(fs.readFileSync(path.join(__dirname, "/conf.json"), 'utf8'));
} catch (e) {

}

module.exports = obj;
