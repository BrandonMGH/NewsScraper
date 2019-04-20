const express = require("express");
const exphbs = require("express-handlebars");
const axios = require("axios");
const cheerio = require("cheerio");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 8080;

const db = require("./models");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/quilletteDB";

mongoose
    .connect(MONGODB_URI, { useNewUrlParser: true }, (err) => {
        if (err) throw err;
        console.log("Database Connected!");
    });


app.use(express.static("public"));

app.get("/", function (req, res) {
    db.Article
        .find({})
        .populate("comments")
        .then(dbArticles => {
            // res.json(dbArticles);
            res.render("home", {articles: dbArticles});
        });
})

app.get("/scrape", (req, res) => {
    axios.
        get("https://quillette.com/")
        .then(response => {
            const $ = cheerio.load(response.data)
            // console.log(response.data)
            $("div.story").each(function (i, element) {
                let title = $(element).find("h3.entry-title").find("a").text();
                let author = $(element).find("div.entry-author").find("a").text();
                let snippet = $(element).find("p.summary").text();
                let link = $(element).find("h3.entry-title").find("a").attr("href")
                // let pic = $(element).find("div.entry-thumb").find("a").find("img");
                let postObj = {
                    // pic: pic, 
                    title: title,
                    author: author,
                    snippet: snippet,
                    link: link
                };
                db.Article
                    .create(postObj)
                    .then(dbArticle => console.log(dbArticle))
                    .catch(err => console.log(err));
            });

            res.render("scrape");
        });

});

app.post("/api/:articleId/comment", (req, res) => {
    db.Comment
        .create({body: req.body.body})
        .then(dbComment => {
            return db.Article.findOneAndUpdate({_id: req.params.articleId}, {$push: { comments: dbComment._id}}, {new: true})
        })
        .then(() => res.redirect("/"))
        .catch(err => res.json(err));
});

app.delete("/api/:articleId/comment", (req, res) => {
    db.Comment
        .deleteOne({_id: req.params.articleId})
//         .then(dbComment => {
//             return db.Article.findOneAndUpdate({_id: req.params.articleId}, {$push: { comments: dbComment._id}}, {new: true})
//         })
        .then(() => res.redirect("/"))
        .catch(err => res.json(err));
});

app.delete("/", (req, res) => {
    db.Article
        .remove({})
//         .then(dbComment => {
//             return db.Article.findOneAndUpdate({_id: req.params.articleId}, {$push: { comments: dbComment._id}}, {new: true})
//         })
        .then(() => res.redirect("/"))
        .catch(err => res.json(err));
});

app.listen(PORT, () => console.log(`App is on http://localhost:${PORT}`));