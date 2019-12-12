const express = require('express');
const router = express.Router();
const fs = require('fs');

//Import the Spotify API
const Spotify = require('./spotify-api');

//Import our Keys File
var keys = require('./keys');

//Create a Spotify Client
var spotify = new Spotify(keys.spotifyKeys);

var genres = {};
fs.readFile('./genres.json', (err, data) => {
    if (err) throw err;
    genres = JSON.parse(data);
    console.log(genres);
});

/* GET home page. */
router.get('/', function (req, res) {
    var results = [];
    res.render('index', {title: 'The most popular 5 tracks (songs) of that artist', results: results, errors: null});
});

router.get('/tracks/:genre', async function (req, res) {
    const genreInput = req.params.genre;
    var artistId = null;
    if (!genreInput) {
        res.status(400).json({ success: false, msg: "Empty genre parameter" });
    }
    if (!genres[genreInput]) {
        res.status(400).json({ success: false, msg: "Can't find this genre in pre-defined genres.json file" });
    }

    const randomIdx = Math.floor(Math.random() * (genres[genreInput].length));
    console.log(randomIdx);

    const artistFound = genres[genreInput][randomIdx];
    console.log(artistFound);

    spotify.search({ type: 'artist', query: artistFound}, function(err, data) {
        if (err) {
            res.status(400).json({ success: false, msg: "Error occurred: "  + err});
        }

        artistId = data["artists"]["items"][0]["id"];
        console.log(artistId);
        if (!artistId) {
            res.status(400).json({ success: false, msg: "Can not find artist id for : "  + artistFound});
        }

        spotify.artists({ type: 'top-tracks', query: artistId}, function(err, data) {
            if (err) {
                res.status(400).json({ success: false, msg: "Error occurred: "  + err});
            }

            //Store the results of a request to spotify
            var results = [];
            var results_cnt = data["tracks"].length;
            if (results_cnt > 5) {
                results_cnt = 5;
            }
            for (var i = 0; i < results_cnt; i++) {
                results.push({artist: data["tracks"][i].artists[0].name,
                              track: data["tracks"][i].name,
                              album_image_url: data["tracks"][i].album.images[1].url,
                              release_date: data["tracks"][i].album.release_date});

            }

            return res.json(results);
        });
    });
});

router.post('/', function (req, res) {
    var genreInput = req.body.param_genre;
    var results = [];
    var artistId = null;
    if (!genreInput) {
        res.render('index', {title: 'The most popular 5 tracks (songs) of that artist', results: results, errors: "Empty genre parameter"});
        return res.status(200);
    }
    if (!genres[genreInput]) {
        res.render('index', {title: 'The most popular 5 tracks (songs) of that artist', results: results, errors: "Can't find this genre in pre-defined genres.json file"});
        return res.status(200);
    }

    const randomIdx = Math.floor(Math.random() * (genres[genreInput].length));
    console.log(randomIdx);

    const artistFound = genres[genreInput][randomIdx];
    console.log(artistFound);

    spotify.search({ type: 'artist', query: artistFound}, function(err, data) {
        if (err) {
            res.render('index', {title: 'The most popular 5 tracks (songs) of that artist', results: results, errors: "Error occurred: "  + err});
            return res.status(200);
        }

        artistId = data["artists"]["items"][0]["id"];
        console.log(artistId);
        if (!artistId) {
            res.render('index', {title: 'The most popular 5 tracks (songs) of that artist', results: results, errors: "Can not find artist id for : "  + artistFound});
            return res.status(200);
        }

        spotify.artists({ type: 'top-tracks', query: artistId}, function(err, data) {
            if (err) {
                res.render('index', {title: 'The most popular 5 tracks (songs) of that artist', results: results, errors: "Error occurred: "  + err});
                return res.status(200);
            }

            //Store the results of a request to spotify
            var results = [];
            var results_cnt = data["tracks"].length;
            if (results_cnt > 5) {
                results_cnt = 5;
            }
            for (var i = 0; i < results_cnt; i++) {
                results.push({artist: data["tracks"][i].artists[0].name,
                              track: data["tracks"][i].name,
                              album_image_url: data["tracks"][i].album.images[1].url,
                              release_date: data["tracks"][i].album.release_date});

            }

            res.render('index', {title: 'The most popular 5 tracks (songs) of that artist', results: results, errors: null});
        });
    });
});

module.exports = router;
