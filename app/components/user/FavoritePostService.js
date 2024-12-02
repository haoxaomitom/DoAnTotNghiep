app.service('FavoritesService', ['$http', function ($http) {
    const token = localStorage.getItem('token');

    // Lấy danh sách yêu thích của người dùng
    this.getFavoritesByUserId = function (userId, page, size) {
        return $http.get(`http://localhost:8080/api/favorites/user/${userId}?page=${page}&size=${size}`, {
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

}]);
