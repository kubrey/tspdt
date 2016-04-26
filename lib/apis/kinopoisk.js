"use strict";

const path = require('path');
const conf = require(path.join(__dirname, "../conf"));
const request = require('request');

function findMovieData(movie) {
    let baseUrl = conf.api.kinopoisk.baseUrl;
    var movieTitle = movie.Title.split(' ').join(',');
    var url = baseUrl + "/searchFilms?keyword=" + movieTitle;
    var movies = [];
    request.get(url, (err, response, data)=> {
        if (err) {
            return null;
        }
        if(data == "null"){
            return null;
        }

        try {
            let dataObj = JSON.parse(data);
            if(!data.pagesCount){
                return null;
            }

            var dataMovie = dataObj.searchFilms[0];
            console.log(dataMovie);
                if (dataMovie) {
                    movie.kinopoiskRating = dataMovie.rating;
                    //console.log(dataObj.imdbVotes);
                    movie.kinopoiskID = dataMovie.id;
                    movie.kinopoiskUrl = "http://www.kinopoisk.ru/film/" + dataObj.id + "/";
                }

        } catch (e) {
            return null;
        }
        return movie;

    });

}

module.exports = {
    parse:findMovieData
};
