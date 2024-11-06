// Create the FavoritesController
app.controller('FavoritesController', ['$scope', 'FavoritesService', function ($scope, FavoritesService) {
    const userId = 1;
    $scope.favorites = [];
    $scope.loading = true;

    // Function to get favorite data
    $scope.getFavorites = function () {
        FavoritesService.getFavoritesByUserId(userId)
            .then(function (response) {
                console.log("API Response:", response.data); // Debugging log
                $scope.favorites = response.data.data; // Corrected to access the nested data array
                $scope.loading = false;
            }, function (error) {
                $scope.loading = false;
                console.error('Error fetching favorites:', error);
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

    // Call the function to fetch favorites when the controller is initialized
    $scope.getFavorites();
}]);
