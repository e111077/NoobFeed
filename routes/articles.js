var express = require('express');
var router  = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var Article = require('../models/article');

var findAllArticles = function(req, res) {
  Article.find(function(err, articles) {
    if(err) {
      res.status(500).end();
    }

    console.log(articles);

    res.json(articles);
  })
};

var findAllArticlesCallback = function(req, res) {
  return function(err, article){
    findAllArticles(req, res);
  }
};

router.get('/', findAllArticles);

router.post('/', function(req, res) {
  var url = req.body.url;
  var title = '';
  var content = '';
  var error = false;
  var options = {
    uri:url,
    maxRedirects:100
    // headers: {
    //   'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36'
    // }
  };

  request.defaults({jar: true});

  request(options, function (err, response, body) {
    if(err) {
      console.error(err);
      content = '';
    }

    if (body) {
      var $ = cheerio.load(body);
      title = $('title').html();
      content = $('article').html();
      console.log(content);
    }

    console.log(content);
    if (!content || content == '') {
      error = true;
      title = 'Error in generating url: ' + url;
    }

    Article.create({
      title: title,
      url: url,
      content: content,
      error: error
    }, findAllArticlesCallback(req, res));
  });
});

router.delete('/:articleId', function(req, res) {
  Article.remove({
    _id : req.params.articleId
  }, findAllArticlesCallback(req, res));
});

module.exports = router;