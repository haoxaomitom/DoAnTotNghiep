app.service('PostsService', ['$http', function ($http) {
    this.getPostsByUserId = function (userId, token, page, size) {
        if (!token) {
            console.error("Token is missing!");
            return Promise.reject("Token is missing!");
        }
        return $http.get(`http://localhost:8080/api/posts/user/${userId}?page=${page}&size=${size}`, {
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
