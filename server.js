const express = require("express");
const { engine } = require("express-handlebars"); // uses an constant object "{}"  now
const url = require("url");
const path = require("path");
const request = require("request");
const parser = require("body-parser");

/*
 * Server Setup here
 */

// server requirements
const port = process.env.PORT || 5000; // used for herokuapp
const app = express();

// body parser middleware
app.use(parser.urlencoded({extended: false}));

// set handlebars as middleware for creating dynamic content
app.engine("handlebars", engine());
app.set("view engine", "handlebars"); 

// setup handlebars helpers for data display manipulation
/*engine.registerHelper('toPercentage', function(value, multiplier) {
    return value * multiplier;
});*/

//  page constants
const otherstuff = "this is other stuff";

/*
 * API functions here
 */

// user: kjos.c95g@gmail.com
// API Key: pk_ea51b6b414234d8794331c55654b6c65
// connect to iexapis API: ("https://cloud.iexapis.com/stable/stock/fb/quote?token=pk_ea51b6b414234d8794331c55654b6c65")
// https://api.iex.cloud/v1/tops/last?token=pk_ea51b6b414234d8794331c55654b6c65

// CALL API here here
function callAPI( APIcallback, stockname = "" ) {

    let popularStocks = [ "fb", "aapl", "goog", "amzn", "tsla" ];
    let popularStockIndex = Math.floor( Math.random() * popularStocks.length);

    let APItoken = "pk_ea51b6b414234d8794331c55654b6c65";
    let stock = popularStocks[popularStockIndex] ; // default to FB

    if (stockname !== "") stock = stockname;
    
    // let API_url = "https://cloud.iexapis.com/stable/stock/";
    let API_url = "https://api.iex.cloud/v1/tops/";

    // let API_params = + stock + "/quote?token=" + APItoken;
    let API_params = "last?symbols=" + stock +"&token=" + APItoken;
    
    
    request(
        API_url + API_params,
        { json: true },
        (err, res, body) => {
            if (err) {
                return console.log(err); // error has occurred
            }
            if (res.statusCode === 200) { 
                console.log(API_url + API_params);
                APIcallback(body);
            }
            else {
                APIcallback({ error: "Stock: " + stock + " not found "});
            }
        }
    );
}


/*
 * Routing here
 */

// set up handlebar routes
// routes to homepage
app.get('/', loadHomePage );
app.get('/home', loadHomePage );
app.get('/index', loadHomePage );
app.post('/', loadHomePage );

// routes to about page
app.get('/about', (req, res) => {
    res.render("about", { 
        navbar: "./layouts/navbar",
        stuff: otherstuff
    });
})

/*
 * Common page functions here
 */

// home page for get and post requests
function loadHomePage(req, res) {
    callAPI( (APIData) => {   
        
        console.log(APIData);
        res.render("home", { 
            navbar: "./layouts/navbar",
            stockdata: APIData[0]
            });
        },
        req.body.stock_ticker // body comes from body-parser module
    );
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