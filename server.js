const express = require("express");
const { engine } = require("express-handlebars"); // uses an constant object "{}"  now
const url = require("url");
const path = require("path");

// server requirements
const port = process.env.PORT || 5000; // used for herokuapp
const app = express();

//  page constants
const otherstuff = "this is other stuff";

// set handlebars as middleware for creating dynamic content
app.engine("handlebars", engine());
app.set("view engine", "handlebars"); 

// set up handlebar routes
// route to homepage
app.get('/', (req, res) => {
    res.render("home", { 
        navbar: "./layouts/navbar",
        stuff: otherstuff
    });
})

// set static base folder
app.use( express.static( path.join(__dirname, "views" )));

app.listen(port, ()=> {
    console.log("Server listening on port: " + port);
})