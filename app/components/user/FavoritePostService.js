app.service('FavoritesService', ['$http', function ($http) {
    const token = localStorage.getItem('token');

    // Lấy danh sách yêu thích của người dùng
    this.getFavoritesByUserId = function (userId, page, size) {
        return $http.get(`https://doantotnghiepbe-production.up.railway.app/api/favorites/user/${userId}?page=${page}&size=${size}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    };



    // Bật/tắt trạng thái yêu thích
    this.toggleFavorite = function (userId, postId) {
        return $http.post('https://doantotnghiepbe-production.up.railway.app/api/favorites/toggle', null, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            params: { userId: userId, postId: postId }
        });
    };

}]);
