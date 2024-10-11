let app = angular.module('parkingApp', []);

app.controller('PostController', ['$scope', 'PostService', '$location', function($scope, PostService, $location) {
    $scope.post = {};
    $scope.errorMessage = '';

    const params = new URLSearchParams(window.location.search);
    const id_post = params.get('id'); // This should give you the ID from the URL
    console.log('Extracted id_post:', id_post); // Log the id_post to check its value

    // Function to get the post by ID
    $scope.getPostById = function(id_post) {
        PostService.getPostById(id_post).then(function(data) {
            if (data) {
                $scope.post = data;
            } else {
                $scope.errorMessage = 'Post not found';
            }
        });
    };

    // Call the function with the extracted id_post
    if (id_post) {
        $scope.getPostById(id_post);
    } else {
        $scope.errorMessage = 'Post ID is not defined';
    }
}]);