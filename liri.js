//set environment variables
require("dotenv").config();

// enable axios
var axios = require("axios");
var divider = "\n------------------------------------------------------------\n";

// 
var request = require("request");
var fs = require("fs");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

// user input variables
var searchType = process.argv[2];
var searchInput = process.argv[3];

userResult(searchType, searchInput);

// input function
function userResult(searchType, searchInput) {
    switch (searchType) {
        case "concert-this":
            concertInfo(searchInput);
            break;
        case "spotify-this-song":
            songInfo(searchInput);
            break;
        case "movie-this":
            movieInfo(searchInput);
            break;
        case "do-what-it-says":
            doWhatItSaysInfo();
            break;
        default:
            console.log("Invalid Option. Please type any of the following options: \nconcert-this \nspotify-this-song \nmovie-this \ndo-what-it-says")
    }
}



function concertInfo(searchInput) {
    var queryUrl = "https://rest.bandsintown.com/artists/" + searchInput + "/events?app_id=codingbootcamp";
    request(queryUrl, function(error, response, body) {
        // If the request is successful
        if (!error && response.statusCode === 200) {
            var concerts = JSON.parse(body);
            for (var i = 0; i < concerts.length; i++) {
                console.log("**********EVENT INFO*********");
                console.log(i);
                console.log("Name of the Venue: " + concerts[i].venue.name);
                console.log("Venue Location: " + concerts[i].venue.city);
                console.log("Date of the Event: " + concerts[i].datetime);
                console.log("*****************************");
                console.log(divder);
            }
        } else {
            console.log('Error occurred.');
        }
    });
}
// spotify function

function songInfo(searchInput) {
    if (searchInput === undefined) {
        searchInput = "The Sign";
    }
    spotify.search({
            type: "track",
            query: searchInput
        },
        function(err, data) {
            if (err) {
                console.log("ERROR" + err);
                return;
            }
            var songs = data.tracks.items;
            for (var i = 0; i < songs.length; i++) {
                console.log("====SONG INFO====");
                console.log(i);
                console.log("Song Name: " + songs[i].name);
                console.log("Song Preview: " + songs[i].preview_url);
                console.log("Album: " + songs[i].album.name);
                console.log("Artist(s): " + songs[i].artists[0].name);
                console.log("=================");
                console.log(divider);


            }

        }
    );
};

// movie info function


function movieInfo(movie) {
    if (!movie) { //If no movie is entered, use defaulted
        movie = "Mr. Nobody";
    }
    var URL = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
    axios.get(URL).then(function(response) {
        //console.log (response.data);
        if (response.data) { //If event is found
            var movieData = response.data;
            console.log("\n" + divider);
            console.log("--------- Movie Info -------------")
            console.log("Movie Title: " + movieData.Title);
            console.log("Movie Release Year: " + movieData.Year);
            console.log("Movie Production Country: " + movieInfo.Country);
            console.log("Movie Language: " + movieData.Language);
            console.log("Movie Actors: " + movieData.Actors);
            console.log("\n--------- Movie Ratings -------------")
            console.log("Movie IMDB Rating: " + movieData.imdbRating);
            //Rotten Tomatioes
            var ratings = movieData.Ratings;
            for (var i = 0; i < ratings.length; i++) {
                if (ratings[i].Source === 'Rotten Tomatoes') {
                    console.log("Movie Rotten Tomatoes Rating: " + ratings[i].Value);
                }
            }
            console.log("\n--------- Movie Plot -------------")
            console.log("Movie Title: " + movieData.Plot);
            console.log(divider);
        } else {
            console.log("Cannot find movie");
        }
    });
};

function doWhatItSaysInfo() {
    fs.readFile('random.txt', 'utf8', function(err, data) {
        if (err) {
            return console.log(err);
        }
        var dataArr = data.split(',');
        userResult(dataArr[0], dataArr[1]);
    })
}