"use strict";

const path = require('path');
const conf = require(path.join(__dirname, "../conf"));
const request = require('request');

/**
 *
 * @param movie
 * @param cb
 */
function findMovieData(movie, cb) {
    let baseUrl = conf.api.kinopoisk.baseUrl;
    //console.log("search for kp: ",movie.Title);

    var movieTitle = movie.tspdt.title.split(' ').join('.');
    var url = baseUrl + "/searchFilms?keyword=" + movieTitle;
    request.get(url, (err, response, data)=> {
        if (err) {
            cb(null, movie);
            return;
        }
        if (data == "null") {
            console.log("No data found for " + movieTitle);
            cb(null, movie);
            return;
        }

        try {
            let dataObj = JSON.parse(data);
            if (!dataObj.pagesCount) {
                console.log("No movies found for " + movieTitle);
                cb(null, movie);
                return;
            }

            var dataMovie = dataObj.searchFilms[0];
            if (dataMovie) {
                let rating = null;
                let votes = null;
                if (dataMovie.rating) {
                    let ratingArr = dataMovie.rating.split(' (');
                    if (ratingArr.length == 2) {
                        rating = parseFloat(ratingArr[0]);
                        votes = parseFloat(ratingArr[1]);
                    } else if (ratingArr.length == 1) {
                        //not enough votes to set mark
                        rating = null;
                        votes = ratingArr[0];
                    }
                }
                movie.kinopoisk = {};
                movie.kinopoisk.rating = rating;
                movie.kinopoisk.votes = votes;
                //console.log(dataObj.imdbVotes);
                movie.kinopoisk.id = dataMovie.id;
                movie.kinopoisk.genre = dataMovie.genre;
                movie.kinopoisk.url = "http://www.kinopoisk.ru/film/" + dataMovie.id + "/";
            }

        } catch (e) {
            cb(null, movie);
            return;
        }
        cb(null, movie);
    });

}

module.exports = {
    findOne: findMovieData
};
