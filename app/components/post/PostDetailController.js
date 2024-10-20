app.controller('PostController', ['$scope', 'PostService', 'ItemService', function ($scope, PostService, ItemService) {
    $scope.post = {};
    $scope.user = {};
    $scope.errorMessage = '';
    $scope.showPhone = false;
    $scope.relatedPosts = [];
    $scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.totalPagesCount = 0;
    $scope.loading = true;

    // Extract post ID from URL
    const params = new URLSearchParams(window.location.search);
    const id_post = params.get('id');
    console.log('Extracted id_post:', id_post);

    // Function to get the post by ID
    $scope.getPostById = function (id_post) {
        $scope.loading = true;  // Set loading to true when fetching data
        PostService.getPostById(id_post).then(function (data) {
            if (data) {
                $scope.post = data;
                $scope.user = data.user;
                $scope.loading = false;
                if ($scope.post.districtName) {
                    $scope.getPostsByDistrict();
                } else {
                    console.error('District name is undefined for the post');
                }
            } else {
                $scope.errorMessage = 'Post not found';
                $scope.loading = false;
            }
        }).catch(function (error) {
            console.error('Error fetching post:', error);
            $scope.loading = false;  // Ensure loading is set to false even if there’s an error
        });
    };

    

    // Function to fetch posts related to the same district
    $scope.getPostsByDistrict = function() {
        if ($scope.post.districtName) {
            ItemService.getPosts($scope.post.districtName, $scope.currentPage, $scope.pageSize)
                .then(function(response) {
                    if (Array.isArray(response)) {
                        $scope.relatedPosts = response;
                        $scope.totalPagesCount = Math.ceil(response.length / $scope.pageSize);  
                    } else {
                        console.error('Unexpected response structure:', response);
                    }
                })
                .catch(function(error) {
                    console.error('Error fetching related posts:', error);
                });
        }
    };

    // Go to the next page
    $scope.nextPage = function () {
        if ($scope.currentPage < $scope.totalPagesCount - 1) {
            $scope.currentPage++;
            $scope.getPostsByDistrict();
            console.log("next");
        }
    };

    // Go to the previous page
    $scope.previousPage = function () {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
            $scope.getPostsByDistrict();
            console.log("previous");
        }
    };

    $scope.formatTimeAgo = function (date) {
        let now = new Date();
        let createdAt = new Date(date);
        let timeDiff = Math.floor((now - createdAt) / 1000);

        if (isNaN(timeDiff)) return "Invalid time";

        if (timeDiff < 60) return timeDiff + " seconds ago";
        if (timeDiff < 3600) return Math.floor(timeDiff / 60) + " minutes ago";
        if (timeDiff < 86400) return Math.floor(timeDiff / 3600) + " hours ago";
        return Math.floor(timeDiff / 86400) + " days ago";
    };

    // If the post ID is provided, fetch post details
    if (id_post) {
        $scope.getPostById(id_post);
    } else {
        $scope.errorMessage = 'Post ID is not defined';
    }

    // Call Google Map when the data is ready
    google.charts.load("current", {
        "packages": ["map"],
        "mapsApiKey": "AIzaSyDaqWzB_IIAlUg3Iwp8yFfgjIIFhhMF0IQ"
    });

    google.charts.setOnLoadCallback(function() {
        drawChart($scope.post.latitude, $scope.post.longitude, $scope.post.parkingName);
    });

    // Function to draw the chart
    function drawChart(lat, long, name) {
        var data = google.visualization.arrayToDataTable([
            ['Lat', 'Long', 'Name'],
            [lat, long, name]
        ]);

        var map = new google.visualization.Map(document.getElementById('map_div'));
        map.draw(data, {
            showTooltip: true,
            showInfoWindow: true
        });
    }
}]);
