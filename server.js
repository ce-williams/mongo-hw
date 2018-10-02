// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var path = require("path");
var fs = require("fs");
var connect = require("connect")
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");


// Initialize Express
var app = express();

// app.use(express.static("/public"));

// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];
var foundTitles = [];

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// static directory that will take you to the index html page
app.use(express.static("public"));

// Main route (will take you to the home index page through the static)
app.get("/", function(req, res) {
  res.sendFile(__dirname, "/index.html");
});

// res.sendFile(path.join(__dirname, "../public/blog.html"));
// Route 1
// =======
// This route will retrieve all of the data
// from the scrapedData collection as a json (this will be populated
// by the data you scrape using the next route)


// This route will retrieve all of the data from the db
app.get("/all", function(req, res) {
  // this will find all the results from the "scrapedData"
  // collection in the db
  db.scrapedData.find({}, function(error, found) {
    // if there is an error, log it to the console
    if (error) {
      console.log(error);
    }
    // if there is no error, send the found results
    // to the browser as json
    else {
      res.json(found);
      foundTitles.push(found);
      
    }
    
    
    
  });
});

// Route 2
// =======
// When you visit this route, the server will
// scrape data from the site of your choice, and save it to
// MongoDB.
// TIP: Think back to how you pushed website data
// into an empty array in the last class. How do you
// push it into a MongoDB collection instead?

// this route will scrape data from the tech section of the WSJ
// and place respective data into the mongo db
app.get("/scrape", function(req, res){
  // this line makes a request to the tech section of the WSJ
  request("https://www.wsj.com/news/technology", function(error, res, html) {
    // loads the html body from the above request into the cherrio library
    var $ = cheerio.load(html);
    // this line uses jquery to select elements with a "wsj-headline-link" class
    $(".wsj-headline-link").each(function(i, element) {
      // save the text (title) and link (href) within the "wsj-headline-link" class
      var title = $(element).text();
      var link = $(element).attr("href");
      // if the element has both a title and a link, insert into the db
      if (title && link) {
        //insert into the scrapedData collection of the mongo db
        db.scrapedData.insert ({
          title : title,
          link : link
        },
        function (err, inserted) {
          if (err) {
            // log if one an error is encountered in the query
            console.log(err);
          }
          else {
            // insert
            console.log(inserted)
            console.log()
          }
        });
      }
    });
  });

  // module.exports(res);
  // sends a scrape completed message to the browser
  res.send("Scrape Completed");
});

// module.exports(foundTitles);
/* -/-/-/-/-/-/-/-/-/-/-/-/- */

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
