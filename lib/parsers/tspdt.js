"use strict";

const path = require('path');
const request = require('request');
var cheerio = require('cheerio');

function getMovies(url, cb) {
    var movies = {};
    request.get(url, (err, response, html)=> {
        if (!err && response.statusCode == 200) {
            var movies = parsePage(html);
            cb(null, movies);
        } else {
            cb(err);
        }
    });

}

function parsePage(html) {
    var className = 'table.csv_grid';
    var $ = cheerio.load(html);
    var table = $(className);
    var headers = table.find('thead tr th');
    var columns = [];
    var movieRows = [];
    headers.each((i, elem)=> {
        var columnTitle = $(elem).text();
        columns.push(columnTitle);
    });

    var tableRows = table.find('tbody tr');
    tableRows.each((i, elem)=> {
        let row = {};
        $(elem).find('td').each((i, elem)=> {
            row[columns[i]] = $(elem).text()
        });
        movieRows.push(row);
    });

    return movieRows;
}

module.exports = {
    parse: getMovies
};



