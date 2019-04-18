const mongoose = require("mongoose");
const Schema = mongoose.Schema

const articleSchema = new Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    snippet: {
        type: String,
        required: true
    },
    link: {
        type: String,
        unique: true,
        required: true
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }]

})

const Article = mongoose.model("Article", articleSchema)

module.exports = Article;