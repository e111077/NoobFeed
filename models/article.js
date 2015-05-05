var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
 
var articleSchema = mongoose.Schema({
  title: {
    type: String
  },
  url: {
    type: String
  },
  content: {
    type: String
  },
  error: {
    type: Boolean,
    require: true
  }
});
 
var Article = mongoose.model('Article', articleSchema);
 
module.exports = Article;