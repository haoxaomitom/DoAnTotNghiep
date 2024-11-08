let app = angular.module('parkingApp', ['ngSanitize']);

const token = localStorage.getItem('token');
// Combined service for Post and Comment related functions
app.service('PostService', ['$http', function ($http) {
    this.getPostById = function (id_post) {
        return $http.get('http://localhost:8080/api/posts/' + id_post)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.error('Error fetching post by ID:', error);
                return null;
            });
    };

    // Existing function to get posts count by district
    this.getPostsCountByDistrict = function () {
        return $http.get('http://localhost:8080/api/posts/countByDistrict');
    };

    // Existing function to search posts
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

    // New function to create a comment
    this.createComment = function (commentDTO) {
        return $http.post('http://localhost:8080/api/comments', commentDTO, {
            headers: {
                'Authorization': `Bearer ${token}`  // Add token in the header
            }
        })

            .then(function (response) {
                console.log("run");
                return response.data;
            })
            .catch(function (error) {
                console.error('Error creating comment:', error);
                return null;
            });
    };

    // New function to delete a comment
    this.deleteComment = function (commentId, userId) {
        return $http.delete('http://localhost:8080/api/comments/' + commentId + '?userId=' + userId)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.error('Error deleting comment:', error);
                throw error; // Re-throw to handle it in the controller
            });
    };

    // New function to get comments by post ID
    this.getCommentsByPostId = function (postId, page, size) {
        return $http.get(`http://localhost:8080/api/comments/post/${postId}`, {
            params: {
                page: page,
                size: size
            }
        }).then(function (response) {
            return response.data;
        }).catch(function (error) {
            console.error('Error fetching comments for post:', error);
            return [];
        });
    };
    this.submitReport = function (reportData) {
        return $http.post('http://localhost:8080/api/reports', reportData)
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.error('Error submitting report:', error);
                throw error;
            });
    };
    this.checkFavoriteStatus = function (userId, postId) {
        return $http.get('http://localhost:8080/api/favorites/check', {
            params: { userId: userId, postId: postId }
        });
    };

    this.toggleFavorite = function (userId, postId) {
        return $http.post('http://localhost:8080/api/favorites/toggle', null, {
            params: { userId: userId, postId: postId }
        });
    };
}]);
// Service for fetching related posts
app.service('ItemService', ['$http', function ($http) {
    this.getPosts = function (districtName, page, size) {
        return $http.get('http://localhost:8080/api/posts/related', {
            params: {
                districtName: districtName,
                page: page,
                size: size
            }
        }).then(function (response) {
            return response.data;
        }).catch(function (error) {
            console.error('Error fetching related posts:', error);
        });
    };
}]);
