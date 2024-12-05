var app = angular.module('app', []);

app.service('UpPostService', ['$http', function ($http) {
    // Create post with images and data
    this.createPost = function (postData) {
        return $http.post('http://localhost:8080/api/upPosts/create', postData, {
            headers: { 'Content-Type': 'application/json' }
        }).then(function (response) {
            return response.data;
        }).catch(function (error) {
            console.error('Error during post creation:', error);
            throw error; // Handle error in controller
        });
    };
}]);
