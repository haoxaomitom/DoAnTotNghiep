app.service('PostsService', ['$http', function ($http) {
    this.getPostsByUserId = function (userId, token) {
        if (!token) {
            console.error("Token is missing!");
            return Promise.reject("Token is missing!");
        }
        return $http.get(`http://localhost:8080/api/posts/user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    };

    // Method to get all active posts
    this.getPostsActive = function(token) {
        if (!token) {
            console.error("Token is missing!");
            return Promise.reject("Token is missing!");
        }
        return $http.get('http://localhost:8080/api/posts/waiting', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    };

    // Method to get all posts with WAITING status
    this.getPostsWaiting = function(token) {
        if (!token) {
            console.error("Token is missing!");
            return Promise.reject("Token is missing!");
        }
        return $http.get('http://localhost:8080/api/posts/waiting', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    };

    // Method to get all posts with REJECT status
    this.getPostsReject = function(token) {
        if (!token) {
            console.error("Token is missing!");
            return Promise.reject("Token is missing!");
        }
        return $http.get('http://localhost:8080/api/posts/rejected', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    };

    // Method for deleting a post
    this.deletePost = function(postId, token) {
        return $http.delete(`http://localhost:8080/api/posts/${postId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    };
}]);
