"use strict";

const path = require('path');
const conf = require(path.join(__dirname, "../conf"));
const request = require('request');

var baseUrl = conf.api.imdb.baseUrl;

function findMoviesData(rows) {
    var movies = [];
    for (let iter in rows) {
        if (rows[iter] === undefined) {
            continue;
        }
        //console.log(rows[iter]);
        let movie = {};
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
                        movie.imdbRating = dataObj.imdbRating;
                    }
                    movie.imdbVotes = dataObj.imdbVotes;
                    console.log(dataObj.imdbVotes);
                    movie.imdbID = dataObj.imdbID;
                    movie.imdbUrl = "http://www.imdb.com/title/" + dataObj.imdbID + "/";
                }
            } catch (e) {
                console.log(e);
            }
            movies.push(movie);

        });
        if (movies.length > 10) {
            break;
        }
    }

    require('fs').writeFileSync(path.join(__dirname, "../tmp/imdb.json"), JSON.stringify(movies));

    console.log(movies);
}

module.exports = {
    search: findMoviesData
};