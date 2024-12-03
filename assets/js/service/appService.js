// app/services/postService.js
app.service("PostService", function ($http) {
    var baseUrl = "http://localhost:8080/api/posts";
  
    // Lấy tất cả bài đăng
    this.getAllPosts = function () {
      return $http.get(baseUrl + "/all");
    };
  });
  