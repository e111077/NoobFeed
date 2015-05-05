var NoobFeed = angular
  .module('NoobFeed', [])
  .controller('mainController',
    ['$scope', '$http', '$sce',
function ($scope, $http, $sce) {
  function parseArticleHtml (data) {
    var parsedData = [];

    // parse data
    for(var i=0; i<data.length; i++) {
      var article = data[i];
      console.log(article);
      article.content = $sce.trustAsHtml(article.content);


      parsedData[i] = article;
    }

    return parsedData;
  }
  $scope.formData = {};

  $http.get('/articles/')
    .success(function(data) {
      

      $scope.articles = parseArticleHtml(data);
      console.log($scope.articles);
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });

  $scope.createArticle = function() {
    $http.post('/articles/', $scope.formData)
      .success(function(data) {
        $scope.formData = {};
        $scope.articles = parseArticleHtml(data);
        console.log(data);
      })
      .error(function(data) {
        // TODO: ERROR MESSAGES
        console.log('Error: ' + data);
      });
  };

  // delete a todo after checking it
  $scope.deleteArticle = function(id) {
    $http.delete('/articles/' + id)
      .success(function(data) {
        $scope.articles = parseArticleHtml(data);
        console.log(data);
      })
      .error(function(data) {
        // TODO: ERROR MESSAGES
        console.log('Error: ' + data);
      });
  };
}]);