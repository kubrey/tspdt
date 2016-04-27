"use strict";

const path = require('path');
const conf = require(path.join(__dirname, "../conf"));
const request = require('request');
const kino = require(path.join(__dirname, "/kinopoisk"));

var baseUrl = conf.api.imdb.baseUrl;

/**
 *
 * @param movie
 * @param cb
 */
function findMovieData(movie, cb) {
    request.get(baseUrl + "/?t=" + movie.tspdt.title + "&y=" +  movie.tspdt.year + "&plot=full&r=json", (err, response, data)=> {
        if (err) {
            cb(err);
            return;
        }
        try {
            let dataObj = JSON.parse(data);
            if (dataObj.Response === "True") {
                if (dataObj) {
                    movie.rating = dataObj.imdbRating;
                }
                movie.imdb = {};
                movie.imdb.votes = dataObj.imdbVotes;
                movie.imdb.id = dataObj.imdbID;
                movie.imdb.url = "http://www.imdb.com/title/" + dataObj.imdbID + "/";
            }
        } catch (e) {
            cb(e.message);
            return;
        }
        cb(null, movie);
    });
}

module.exports = {
    findOne: findMovieData
};