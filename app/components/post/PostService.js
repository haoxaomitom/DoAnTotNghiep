app.service('ItemService', function ($http) {
    this.getPosts = function (page, size) {
        return $http.get('http://localhost:8080/api/posts/top?page=' + page + '&size=' + size);
    };
});

// API for fetching location data
app.service('LocationService', ['$http', function ($http) {
    this.getProvinces = function () {
        return $http.get('https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json');
    };
}]);

// API for fetching posts count by district and search
app.service('PostService', ['$http', function ($http) {
    // Fetch paginated posts
    this.getPosts = function (page, size) {
        return $http.get('http://localhost:8080/api/posts/top');
    };

    // Fetch posts count by district
    this.getPostsCountByDistrict = function () {
        return $http.get('http://localhost:8080/api/posts/countByDistrict');
    };

    // Search posts by search term and district
    this.searchPosts = function (searchTerm, selectedDistrictName, page) {
        return $http({
            method: 'GET',
            url: 'http://localhost:8080/api/posts/search',
            params: {
                searchTerm: searchTerm,
                district: selectedDistrictName,
                page: page
            }
        });
    };

    // Search posts by vehicle type
    this.searchPostsByVehicleType = function (vehicleType, page) {
        return $http({
            method: 'GET',
            url: 'http://localhost:8080/api/posts/searchVehicleType',
            params: {
                vehicleType: vehicleType,
                page: page
            }
        });
    };

    // Sort posts by price
    this.sortPostsByPrice = function (sortOrder, page, size) {
        return $http({
            method: 'GET',
            url: 'http://localhost:8080/api/posts/sort',
            params: {
                sort: sortOrder,
                page: page,
                size: size
            }
        });
    };
}]);
