"use strict";

const path = require('path');
var mongo = require(path.join(__dirname, "../libs/mongoose"));

var schemaOptions = {
    //capped: 500000,
    collection: 'movies21century'
};

var schema = mongo.Schema({
    created: {type: Date, default: Date.now},
    tspdt: {
        Pos: Number,
        Title: String,
        Director: String,
        Country: String,
        Year: Number,
        Mins: Number,
        Yprev: Number
    },
    imdb: {
        rating: Number,
        votes: Number,
        url: String
    },
    kinopoisk: {
        rating: Number,
        votes: Number,
        url: String,
        genre: String
    }
}, schemaOptions);

var movies21cent = mongo.model(schemaOptions.collection, schema);

module.exports = movies21cent;