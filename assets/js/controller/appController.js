// app/controllers/postController.js
app.controller("PostController", function ($scope, PostService) {
    $scope.posts = [];
    $scope.errorMessage = "";
  
    // Load tất cả bài đăng
    $scope.loadPosts = function () {
      PostService.getAllPosts()
        .then(function (response) {
          $scope.posts = response.data;
          console.log("Posts loaded:", $scope.posts);
        })
        .catch(function (error) {
          $scope.errorMessage = "Không thể tải danh sách bài đăng. Vui lòng thử lại sau.";
          console.error("Error loading posts:", error);
        });
    };
  
    // Gọi hàm loadPosts khi khởi tạo controller
    $scope.loadPosts();
  });
  