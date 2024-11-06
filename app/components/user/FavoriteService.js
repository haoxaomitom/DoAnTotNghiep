// Define the AngularJS module if not already defined
var app = angular.module('favoriteApp', []);

// Create a service for fetching favorites
app.service('FavoritesService', ['$http', function($http) {
    this.getFavoritesByUserId = function(userId) {
        return $http.get(`http://localhost:8080/api/favorites/user/${userId}`);
    };
}]);
