"use strict";

const path = require('path');
const conf = require(path.join(__dirname, "../conf"));
const request = require('request');

var baseUrl = conf.api.imdb.baseUrl;

function findMoviesData(rows) {
    var movies = [];
    for (let iter in rows) {
        //console.log(rows[iter]);
        let movie = {};
        request.get(baseUrl + "/?t=" + rows[iter].Title + "&y=" + rows[iter].Year + "&plot=full&r=json", (err, response, data)=> {
            if (err) {
                movies.push(rows[iter]);
                return;
            }
            movie = rows['iter'];
            try {
                let dataObj = JSON.parse(data);
                if (dataObj.Response === "True") {
                    movie.imdbRating = dataObj.imdbRating;
                    movie.imdbVotes = dataObj.imdbVotes;
                    movie.imdbID = dataObj.imdbID;
                }
            } catch (e) {
                console.log(e);
            }
            movies.push(movie);

        });
    }

    require('fs').writeFileSync(path.join(__dirname,"../tmp/imdb.json"),JSON.stringify(movies));

    //console.log(movies);
}

module.exports = {
    search: findMoviesData
};