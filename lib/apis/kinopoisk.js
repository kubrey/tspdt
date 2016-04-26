"use strict";

const path = require('path');
const conf = require(path.join(__dirname, "../conf"));
const request = require('request');

function findMovieData(movie) {
    let baseUrl = conf.api.kinopoisk, baseUrl;
    var movieTtitle = movie.Title.split(' ').join(',');
    var url = baseUrl + "/searchFilms?keyword=" + movieTtitle;
    var movies = [];
    var movie = {};
    request.get(baseUrl + "/?t=" + rows[iter].Title + "&y=" + rows[iter].Year + "&plot=full&r=json", (err, response, data)=> {
        if (err) {
            movies.push(rows[iter]);
            return;
        }
        movie = rows[iter];
        try {
            let dataObj = JSON.parse(data);
            if (dataObj.Response === "True") {
                if (dataObj) {
                    movie.kinopoiskRating = dataObj.rating;
                }
                console.log(dataObj.imdbVotes);
                movie.kinopoiskID = dataObj.id;
                movie.kinopoiskUrl = "http://www.kinopoisk.ru/film/" + dataObj.id + "/";
            }
        } catch (e) {
            console.log(e);
        }
        movies.push(movie);

    });

}
