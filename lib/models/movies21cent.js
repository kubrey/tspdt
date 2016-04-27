"use strict";

const path = require('path');
var mongo = require(path.join(__dirname, "../libs/mongoose"));

var schemaOptions = {
    //capped: 500000,
    collection: 'movies21cent'
};

var schema = mongo.Schema({
    created: {type: Date, default: Date.now},
    tspdt: {
        pos: Number,
        title: String,
        director: String,
        country: String,
        year: Number,
        mins: Number,
        yearprev: Number
    },
    imdb: {
        id: String,
        rating: Number,
        votes: Number,
        url: String
    },
    kinopoisk: {
        id: Number,
        rating: Number,
        votes: Number,
        url: String,
        genre: String
    }
}, schemaOptions);

var movies21cent = mongo.model(schemaOptions.collection, schema);

module.exports = movies21cent;