var app = angular.module('favoriteApp', []);

// Service for fetching favorites
app.service('FavoritesService', ['$http', function($http) {
    this.getFavoritesByUserId = function(userId, token) {
        return $http.get(`http://localhost:8080/api/favorites/user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}` // Đính kèm token vào header
            }
        });
    };
}]);