app.controller('PostsController', ['$scope', 'PostsService', function ($scope, PostsService) {
    // Define the user ID
    const userId = 1; // Replace with actual logged-in user ID
    $scope.posts = []; // Correctly define posts, not favorites
    $scope.loading = true;

    // Function to get posts data
    $scope.getPosts = function () {
        PostsService.getPostsByUserId(userId)
            .then(function (response) {
                // Assuming response.data is an array of post items
                $scope.posts = response.data; // Store the response data
                $scope.loading = false; // Set loading to false after data is fetched
            }, function (error) {
                $scope.loading = false; // Set loading to false on error
                console.error('Error fetching posts:', error);
            });
    };

    // Format time function
    $scope.formatTimeAgo = function (date) {
        let now = new Date();
        let createdAt = new Date(date);
        let timeDiff = Math.floor((now - createdAt) / 1000);

        if (isNaN(timeDiff)) return "Invalid time";

        if (timeDiff < 60) return timeDiff + " giây trước";
        if (timeDiff < 3600) return Math.floor(timeDiff / 60) + " phút trước";
        if (timeDiff < 86400) return Math.floor(timeDiff / 3600) + " giờ trước";
        return Math.floor(timeDiff / 86400) + " ngày trước";
    };

    // Call the function to fetch posts when the controller is initialized
    $scope.getPosts();
}]);