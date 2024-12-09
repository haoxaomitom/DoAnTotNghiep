let app = angular.module('myApp', []);

app.service('PostDetailService', ['$http', function($http) {
    // Service để lấy dữ liệu bài đăng dựa vào ID
    this.getPostById = function(postId) {
        return $http.get(`http://localhost:8080/api/posts/${postId}`);
    };
}]);
