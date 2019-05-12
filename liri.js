require("dotenv").config();
var axios = require("axios");
var fs = require("fs");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotifykey = new Spotify(keys.spotify);
var type = process.argv[2];
var research = process.argv.splice(3).join(" ");


function music() {
  var divider = "\n------------------------------------------------------------\n\n";
  spotifykey
    .search({ type: "track", query: research, limit: 1 })
    .then(function(response) {
      
      var artist = response.tracks.items[0].artists[0].name;
      var album = response.tracks.items[0].album.name;
      var link = response.tracks.items[0].artists[0].external_urls.spotify;
      var results = [
      "The Song is: " + research,
      "The Band is: " + artist,
      "The Album is: " + album,
      "The Preview Link is: " + link
    ].join("\n\n");
   
    fs.appendFile("log.txt", results + divider, function(err) {
      if (err) throw err;
      console.log(results);
    });
    });
 
}

function concert() {
  var divider = "\n------------------------------------------------------------\n\n";
  axios.get("https://rest.bandsintown.com/artists/" + research + "/events?app_id=codingbootcamp")
    .then(function(response) {
      var concert = response.data[0];
      var datetime = concert.datetime;
      var year = datetime.substring(0, 4);
      var month = datetime.substring(5, 7);
      var day = datetime.substring(8, 10);
      var concertResults = [
      "Band/Artist: " + research,
      "Name of Venue: " + concert.venue.name,
      "Venue Location: " + concert.venue.city + ", " + concert.venue.region + concert.venue.country,
      "Date of the Event: " + month + "/" + day + "/" + year
      ].join("\n\n");

      fs.appendFile("log.txt", concertResults + divider, function(err) {
        if (err) throw err;
        console.log(concertResults);
    });
  
});
};


function movie() {
  var divider = "\n------------------------------------------------------------\n\n";
  axios
    .get("http://www.omdbapi.com/?apikey=trilogy&t=" + research)
    .then(function(response) {
      var movie = response.data;

      var movieResults = [
      "Movie Title: " + movie.Title,
      "Year: " + movie.Year,
      "Ratings: " + movie.Ratings[0].Source + ": " + movie.Ratings[0].Value,
      "Addt’l. Ratings: " + movie.Ratings[1].Source + ": " + movie.Ratings[1].Value,
      "Conutry: " + movie.Country,
      "Language: " + movie.Language,
      "Plot: " + movie.Plot,
      "Actors: " + movie.Actors
      ].join("\n\n");

      fs.appendFile("log.txt", movieResults + divider, function(err) {
        if (err) throw err;
        console.log(movieResults);

    });
  
});
};

function command() {
  if (type === "spotify-this-song") {
    if (research === "") {
      research = "The Sign Ace of Base";
    }
    music();
  }

  if (type === "concert-this") {
    concert();
  }

  if (type === "movie-this") {
    if (research === "") {
      research = "Mr.Nobody";
    }
    movie();
  }
  if (type === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function(error, data) {
      console.log(data);

      var file = data.split(",");
      type = file[0];
      research = file[1];
      command();
    });
  }
}

command();
