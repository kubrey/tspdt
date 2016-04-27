"use strict";

var path = require('path');
var conf = require(path.join(__dirname, "/conf"));
var tspdt = require(path.join(__dirname, "/parsers/tspdt"));
var imdb = require(path.join(__dirname, "/apis/imdb"));
var kp = require(path.join(__dirname, "/apis/kinopoisk"));

if (!conf) {
    console.log("Failed to get config data");
    process.exit(-1);
}

var links = conf.tspdt;
var moviesHandled = [];

for (let iter in links) {
    if (!links[iter]) {
        continue;
    }
    var cb = function (err, movies) {

        if (err) {
            console.log(err);
            return;
        }
        let all = movies.length;
        let count = 0;
        for (let m in movies) {
            handleMovie(movies[m], (err, mv)=> {
                count++;
                if (err) {
                    console.log(err);
                    return;
                }
                moviesHandled.push(mv);
                if (count == all) {
                    console.log(iter + " done");
                    require('fs').writeFileSync(path.join(__dirname, "/tmp/" + iter + ".json"), require('util').inspect(moviesHandled));
                }
            });
        }
    };
    tspdt.parse(links[iter], cb);
    break;

}

/**
 *
 * @param movie
 * @param cb
 */
function handleMovie(movie, cb) {
    promisize(imdb.findOne, movie).then(movieHandled=> {
        return promisize(kp.findOne, movieHandled);
    }).then(mvHandled=> {
        cb(null, mvHandled);
    }).catch(error=> {
        cb(error);
    });
}

/**
 *
 * @param {Function} fn
 * @param {Mixed} arg
 * @return {Promise}
 */
function promisize(fn, arg) {
    return new Promise(function (resolve, reject) {
        fn(arg, (err, result)=> {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}
