app.service('ItemService', function($http) {
    this.getPosts = function(page, size) {
        return $http.get('http://localhost:8080/api/posts?page=' + page + '&size=' + size);
    };
});


//API Location
app.service('LocationService', ['$http', function($http) {
    // Fetch provinces data from external JSON file
    this.getProvinces = function() {
        return $http.get('https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json');
    };
}]);

//API Count post on district
app.service('PostService', ['$http', function($http) {
    this.getPostsCountByDistrict = function() {
        return $http.get('http://localhost:8080/api/posts/countByDistrict');
    };
}]);

