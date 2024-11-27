app.service('FavoritesService', ['$http', function ($http) {
    const token = localStorage.getItem('token');

    // Lấy danh sách yêu thích của người dùng
    this.getFavoritesByUserId = function (userId) {
        return $http.get(`http://localhost:8080/api/favorites/user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    };

    // Bật/tắt trạng thái yêu thích
    this.toggleFavorite = function (userId, postId) {
        return $http.post('http://localhost:8080/api/favorites/toggle', null, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: { userId: userId, postId: postId }
        });
    };

    // Lấy thông tin chi tiết bài viết bằng ID
    this.getPostById = function (id_post) {
        return $http.get(`http://localhost:8080/api/posts/${id_post}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(function (response) {
                return response.data.data; // Giả định API trả về dữ liệu bài viết trong `data.data`
            })
            .catch(function (error) {
                console.error('Error fetching post by ID:', error);
                return null;
            });
    };
}]);
