let app = angular.module('parkingApp', []);

// PostService for fetching individual post details and related functions
app.service('PostService', ['$http', function($http) {
    this.getPostById = function(id_post) {
        return $http.get('http://localhost:8080/api/posts/' + id_post)
            .then(function(response) {
                return response.data;
            })
            .catch(function(error) {
                console.error('Error fetching post by ID:', error);
                return null;
            });
    };

    // Existing function to get posts count by district
    this.getPostsCountByDistrict = function() {
        return $http.get('http://localhost:8080/api/posts/countByDistrict');
    };

    // Existing function to search posts
    this.searchPosts = function(searchTerm, selectedDistrictName, page) {
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
}]);

app.service('ItemService', ['$http', function($http) {
    this.getPosts = function(districtName, page, size) {
        return $http.get('http://localhost:8080/api/posts/related', {
            params: {
                districtName: districtName, // Use district name to fetch related posts
                page: page,
                size: size
            }
        }).then(function(response) {
            return response.data;
        }).catch(function(error) {
            console.error('Error fetching related posts:', error);
        });
    };
}]);
