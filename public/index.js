// var server = require("../server.js")
$(document).ready(function () {

    // module.import("../server.js");

    // module.import(foundTitles);


    // Initates a new scrape
    $("#newScrape").on("click", function() {
        window.location = "http://localhost:3000/scrape";

    });

    $("#seeAll").on("click", function() {
        window.location = "http://localhost:3000/all";
        for (i=0; foundTitles.length; i++) {
            $("headlineDiv").append(foundTitles[i].title.text());
        }

    });



});