const express = require("express");
const { engine } = require("express-handlebars"); // uses an constant object "{}"  now
const url = require("url");
const path = require("path");
const request = require("request");

// server requirements
const port = process.env.PORT || 5000; // used for herokuapp
const app = express();

//  page constants
const otherstuff = "this is other stuff";

// user: kjos.c95g@gmail.com
// API Key: pk_ea51b6b414234d8794331c55654b6c65
// connect to iexapis API: ("https://cloud.iexapis.com/stable/stock/fb/quote?token=pk_ea51b6b414234d8794331c55654b6c65")

// call api here
function callAPI( APIcallback ) {
    request(
        "https://cloud.iexapis.com/stable/stock/fb/quote?token=pk_ea51b6b414234d8794331c55654b6c65", 
        { json: true },
        (err, res, body) => {
            if (err) {
                return console.log(err); // error has occurred
            }
            if (res.statusCode === 200) { 
                APIcallback(body);
            }
        }
    );
        
}

// set handlebars as middleware for creating dynamic content
app.engine("handlebars", engine());
app.set("view engine", "handlebars"); 

// set up handlebar routes
// route to homepage
app.get('/', loadHomePage );
app.get('/home', loadHomePage );
app.get('/index', loadHomePage );

// routes to about page
app.get('/about', (req, res) => {
    res.render("about", { 
        navbar: "./layouts/navbar",
        stuff: otherstuff
    });
})

// load common pages here
// home page
function loadHomePage(req, res) {
    callAPI( function(APIData) {   
        res.render("home", { 
            navbar: "./layouts/navbar",
            stockdata: APIData
        });
    });
}

// about page
function loadAboutPage(req, res) {
    res.render("home", { 
        navbar: "./layouts/navbar",
        stuff: otherstuff
    });
}

// set static base folder
app.use( express.static( path.join(__dirname, "views" )));

app.listen(port, ()=> {
    console.log("Server listening on port: " + port);
})