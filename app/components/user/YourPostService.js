var app = angular.module('yourPostsApp', []);

app.service('PostsService', ['$http', function($http) {
    this.getPostsByUserId = function(userId, token) {
        return $http.get(`http://localhost:8080/api/posts/user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}` // Gửi token trong header
            }
        });
    };
}]);