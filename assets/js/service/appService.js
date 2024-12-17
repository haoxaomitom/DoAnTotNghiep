// app/services/postService.js
app.service("PostService", function ($http) {
    var baseUrl = "https://doantotnghiepbe-production.up.railway.app/api/posts";
  
    // Lấy tất cả bài đăng
    this.getAllPosts = function () {
      return $http.get(baseUrl + "/all");
    };
  });
  