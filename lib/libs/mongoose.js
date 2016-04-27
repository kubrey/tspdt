"use strict";

var mongoose = require('mongoose');
var path = require('path');
var config = require(path.join(__dirname, '../conf'));
mongoose.connect(config.mongoose.uri, config.mongoose.options);

//mongoose.set('debug', true);

module.exports = mongoose;
