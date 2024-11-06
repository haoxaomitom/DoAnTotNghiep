var app = angular.module('yourPostsApp', []);

app.service('PostsService', ['$http', function($http) {
    this.getPostsByUserId = function(userId) {
        return $http.get(`http://localhost:8080/api/posts/user/${userId}`);
    };
}]);