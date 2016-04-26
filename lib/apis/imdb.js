"use strict";

const path = require('path');
const conf = require(path.join(__dirname, "../conf"));
const request = require('request');
const kino = require(path.join(__dirname,"/kinopoisk"));

var baseUrl = conf.api.imdb.baseUrl;

function findMoviesData(rows) {
    var movies = [];
    var counter = 0;
    for (let iter in rows) {
        if (rows[iter] === undefined) {
            counter++;
            continue;
        }
        //console.log(rows[iter]);
        let movie = {};
        request.get(baseUrl + "/?t=" + rows[iter].Title + "&y=" + rows[iter].Year + "&plot=full&r=json", (err, response, data)=> {
            counter++;
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

            var kinoData = kino.parse(movie);
            if(kinoData){
                movie = kinoData;
            }

            console.log(counter);

            movies.push(movie);
            if (movies.length > 990 && counter==1000) {
                require('fs').writeFileSync(path.join(__dirname, "../tmp/imdb.json"), JSON.stringify(movies));
                require('fs').writeFileSync(path.join(__dirname, "../tmp/imdb.log"),require('util').inspect(movies));
               process.exit(-1);
            }

        });

    }



    //console.log(movies);
}

module.exports = {
    search: findMoviesData
};