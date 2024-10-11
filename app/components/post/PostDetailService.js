app.service('PostService', ['$http', function($http) {
    this.getPostById = function(id_post) {
        return $http.get('http://localhost:8080/api/posts/' + id_post)
            .then(function(response) {
                return response.data;
            })
            .catch(function(error) {
                console.error('Error fetching post by ID:', error);
                return null;
            });
    };
}]);