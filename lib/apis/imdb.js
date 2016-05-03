"use strict";

const path = require('path');
const conf = require(path.join(__dirname, "../conf"));
const request = require('request');

var baseUrl = conf.api.imdb.baseUrl;

/**
 *
 * @param movie
 * @param cb
 */
function findMovieData(movie, cb) {
    request.get(baseUrl + "/?t=" + movie.tspdt.title + "&y=" +  movie.tspdt.year + "&plot=full&r=json", (err, response, data)=> {
        if (err) {
            cb(null,movie);
            return;
        }
        try {
            let dataObj = JSON.parse(data);
            if (dataObj.Response === "True") {

                movie.imdb = {};
                if (dataObj) {
                    if(dataObj.imdbRating == 'N/A'){
                        dataObj.imdbRating = null;
                    }
                    movie.imdb.rating = dataObj.imdbRating;
                }
                if(dataObj.imdbVotes == 'N/A'){
                    dataObj.imdbVotes = null;
                }else {
                    var reg = /,/g;
                    movie.imdb.votes = dataObj.imdbVotes.replace(new RegExp(reg), '');
                }
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