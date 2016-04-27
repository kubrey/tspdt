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
    request.get(baseUrl + "/?t=" + movie.Title + "&y=" + movie.Year + "&plot=full&r=json", (err, response, data)=> {
        if (err) {
            cb(err);
            return;
        }
        try {
            let dataObj = JSON.parse(data);
            if (dataObj.Response === "True") {
                if (dataObj) {
                    movie.imdbRating = dataObj.imdbRating;
                    if (dataObj.imdbRating > 7.5) {
                        console.log(movie.Title);
                    }
                }
                movie.imdbVotes = dataObj.imdbVotes;
                movie.imdbID = dataObj.imdbID;
                movie.imdbUrl = "http://www.imdb.com/title/" + dataObj.imdbID + "/";
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