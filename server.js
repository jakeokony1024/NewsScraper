const express = require("express");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const axios = require("axios");
const cheerio = require("cheerio");


// Require all models
const db = require("./models");

const PORT = 3000;

// Initialize Express
const app = express();

//connect to mongodb mLabs
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsScraper";

mongoose.connect(MONGODB_URI);

// Configure middleware

// Parse request body as JSON
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));
// Connect mongoDB 
mongoose.connect("mongodb://localhost/newsScraper", {
    useNewUrlParser: true
});
// Set up handlebars 
app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");

app.get("/", function(req, res){
    res.render("index")
})

// A GET route for scraping the echoJS website
app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with axios
    axios.get("http://www.echojs.com/").then(function (response) {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        const $ = cheerio.load(response.data);
        let titlesArray = [];


        // Now, we grab every h2 within an article tag, and do the following:
        $("article h2").each(function (i, element) {
            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
                .children("a")
                .text();
            result.link = $(this)
                .children("a")
                .attr("href");
            if (result.title !== "" && result.link !== ""){
                if (titlesArray.indexOf(result.title) == -1){
                    titlesArray.push(result.title); 

                    db.Article.count({title: result.title}, function(err, test){
                        if (test === 0){
                            let entry = new Article(result);
                            entry.save(function(err, doc){
                                if (err) {
                                    console.log(err)
                                } else {
                                    console.log(doc)
                                }
                            })
                        }
                    })
                } else {
                    console.log("Article Aready Exsists");
                }
            } else {
                console.log("Not saved to DB, missing data.");
            }
            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
                .then(function (dbArticle) {
                    // View the added result in the console
                    console.log(dbArticle);
                })
                .catch(function (err) {
                    // If an error occurred, log it
                    console.log(err);
                });
        });

        // Send a message to the client
        res.send("Scrape Complete");
        
    });
});

app.get("/articles", function(req, res){
    db.Article.find({})
    .then(function(dbArticle){
        res.json(dbArticle);
    })
    .catch(function(err){
        res.json(err);
    })
});

app.get("/articles/:id", function(req, res){
    db.Article.findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle){
        res.json(dbArticle);
    })
    .catch(function(err){
        res.json(err);
    });
});

app.post("/articles/:id", function(req, res){
    db.Note.create(req.body)
    .then(function(dbNote){
        return db.Article.findOneAndUpdate({_id: req.params.id}, {note: dbNote._id}, {new: true});
    })
    .then(function(dbArticle){
        res.json(dbArticle);
    })
    .catch(function(err){
        res.json(err);
    });
});


app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});
