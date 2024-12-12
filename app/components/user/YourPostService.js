
app.service('PostsService', ['$http', function ($http) {
    const token = localStorage.getItem('token');
    // this.getPostsByUserId = function (userId) {
    //     return $http.get(`http://localhost:8080/api/posts/user/${userId}`, {
    //         headers: {
    //             'Authorization': `Bearer ${token}`
    //         }
    //     });
    // };
    
    
    // Method for deleting a post
    this.deletePost = function (postId, token) {
        return $http.delete(`http://localhost:8080/api/posts/${postId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    };
}]);
