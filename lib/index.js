"use strict";

var path = require('path');
var conf = require(path.join(__dirname, "/conf"));
var tspdt = require(path.join(__dirname, "/parsers/tspdt"));
var imdb = require(path.join(__dirname, "/apis/imdb"));
var kp = require(path.join(__dirname, "/apis/kinopoisk"));


var coll21cent = require(path.join(__dirname,"/models/movies21cent"));
var collalltime = require(path.join(__dirname,"/models/moviesalltime"));
var collections = {
    coll21cent:coll21cent,
    collalltime:collalltime
};

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
    var cb = function (err, movies, type) {

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
                //let coll = "movies"+iter;
                //let movieModel = new coll21cent(mv);
                if(mv.tspdt.title == 'City of God'){
                    console.log(mv);
                }
                if(type==='21cent') {
                    coll21cent.where({index: (mv.tspdt.title + "+" + mv.tspdt.year).toString()})
                        .setOptions({upsert: true, overwrite: true})
                        .update({$set: mv}, function (err) {
                            if (err) {
                                console.log(err);
                            }
                        });
                }
                if(type==='alltime') {
                    collalltime.where({index: (mv.tspdt.title + "+" + mv.tspdt.year).toString()})
                        .setOptions({upsert: true, overwrite: true})
                        .update({$set: mv}, function (err) {
                            if (err) {
                                console.log(err);
                            }
                        });
                }

                moviesHandled.push(mv);
                if (count == all) {
                    console.log(type + " done");

                    require('fs').writeFileSync(path.join(__dirname, "/tmp/" + type + ".json"), require('util').inspect(moviesHandled));
                }
            });
        }
    };
    tspdt.parse(links[iter],iter, cb);
    //break;

}

/**
 *
 * @param movie
 * @param cb
 */
function handleMovie(movie, cb) {
    //prepare object view
    let prep = prepareObject(movie);

    promisize(imdb.findOne, prep).then(movieHandled=> {
        return promisize(kp.findOne, movieHandled);
    }).then(mvHandled=> {
        cb(null, mvHandled);
    }).catch(error=> {
        cb(error);
    });
}

function prepareObject(movie) {
    let prepared = {};
    let now = new Date;
    let prevYear = now.getFullYear() - 1;
    for (let i in movie) {
        if (i == prevYear) {
            prepared['yearprev'] = movie[i] === '---' ? 0 :  movie[i];
        } else {
            prepared[i.toString().toLowerCase()] = movie[i];
        }
    }
    let index = prepared.title+"-"+prepared.year;
    return {tspdt:prepared,index:index};
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
