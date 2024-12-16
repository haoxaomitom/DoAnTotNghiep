app.service('PostsService', ['$http', function ($http) {
    const token = localStorage.getItem('token');
    // this.getPostsByUserId = function (userId) {
    //     return $http.get(`https://doantotnghiepbe-production.up.railway.app/api/posts/user/${userId}`, {
    //         headers: {
    //             'Authorization': `Bearer ${token}`
    //         }
    //     });
    // };
    
    
    // Method for deleting a post
    this.deletePost = function(postId, token) {
        return $http.put(`http://localhost:8080/api/posts/delete/${postId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    };

    this.getPostsByStatus = function (userId, status, page, size) {
        return $http.get(`http://localhost:8080/api/posts/user`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: {
                userId: userId,
                status: status,
                page: page,
                size: size
            }
        });
    };

}]);

