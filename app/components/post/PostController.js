let app = angular.module('parkingApp', []);

app.controller('ParkingController', ['$scope', '$http', 'ItemService', 'LocationService', 'PostService', function ($scope, $http, ItemService, LocationService, PostService) {
    $scope.posts = [];
    $scope.searchTerm = '';
    $scope.currentPage = 0; // Start from the first page
    $scope.pageSize = 5; // Number of posts per page
    $scope.totalPagesCount = 0; // Total pages returned from the API

    // Fetch posts with pagination
    $scope.getPosts = function () {
        // Gọi API từ service
        ItemService.getPosts($scope.currentPage, $scope.pageSize).then(function (response) {
            $scope.posts = response.data.content;
            $scope.totalPagesCount = response.data.totalPages;
            console.log($scope.posts);
        });
    };

    // Go to the next page
    $scope.nextPage = function () {
        if ($scope.currentPage < $scope.totalPagesCount - 1) {
            $scope.currentPage++;
        }
    };

    // Go to the previous page
    $scope.previousPage = function () {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
    };

    // Fetch provinces and set default selections
    $scope.getProvinces = function () {
        LocationService.getProvinces().then(function (response) {
            $scope.provinces = response.data;

            // Set TP HCM
            $scope.selectedProvince = $scope.provinces.find(province => province.Name === "Thành phố Hồ Chí Minh");
            if ($scope.selectedProvince) {
                // Cập nhật quận/huyện khi chọn TP HCM
                $scope.updateDistricts();
            }
        }).catch(function (error) {
            console.error('Error loading data:', error);
        });
    };


    // Cập nhật danh sách quận/huyện tương ứng với tỉnh được chọn
    $scope.updateDistricts = function () {
        if ($scope.selectedProvince) {
            $scope.districts = $scope.selectedProvince.Districts;
        } else {
            $scope.districts = []; // Nếu không có tỉnh nào được chọn
        }
    };

    $scope.searchPosts = function () {
        // Reset the dropdown selection when a manual search is performed
        $scope.selectedDistrict = null;
    
        // Perform search using the manual input search term
        PostService.searchPosts($scope.searchTerm, $scope.currentPage)
            .then(function (response) {
                if (response.data && response.data.content) {
                    $scope.posts = response.data.content; // Update posts list with search results
                    $scope.totalPagesCount = response.data.totalPages; // Update total pages
                } else {
                    $scope.posts = []; // Clear posts if no data found
                }
            })
            .catch(function (error) {
                console.error('Error fetching posts:', error);
            });
    };
    
    

    $scope.onDistrictChange = function () {
        if ($scope.selectedDistrict && $scope.selectedDistrict.Name) {
            // Use selected district for search
            let searchTerm = $scope.selectedDistrict.Name;
    
            // Perform search using the selected district from dropdown
            PostService.searchPosts(searchTerm, $scope.currentPage)
                .then(function (response) {
                    if (response.data && response.data.content) {
                        $scope.posts = response.data.content; // Update posts list with search results
                        $scope.totalPagesCount = response.data.totalPages; // Update total pages
                    } else {
                        $scope.posts = []; // Clear posts if no data found
                    }
                })
                .catch(function (error) {
                    console.error('Error fetching posts:', error);
                });
        }
    };
    
    // Load the count of posts by district
    $scope.loadDistrictPostCounts = function () {
        PostService.getPostsCountByDistrict().then(function (response) {
            $scope.districtPostCounts = response.data;
        }).catch(function (error) {
            console.error('Error loading district post counts:', error);
        });
    };

    // Format time function
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

    // Initial data load
    $scope.getPosts();
    $scope.getProvinces();
    $scope.loadDistrictPostCounts();
}]);