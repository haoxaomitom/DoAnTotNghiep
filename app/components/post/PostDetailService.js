const token = localStorage.getItem('token');

// Combined service for Post and Comment related functions
app.service('PostDetailService', ['$http', function ($http) {

    // Fetch post by ID
    this.getPostById = function (id_post) {
        return $http.get(`http://localhost:8080/api/posts/${id_post}`)
            .then(response => response.data)
            .catch(error => {
                console.error('Error fetching post by ID:', error);
                return null;
            });
    };

    // Get posts count by district
    this.getPostsCountByDistrict = function () {
        return $http.get('http://localhost:8080/api/posts/countByDistrict');
    };

    // Search posts
    this.searchPosts = function (searchTerm, selectedDistrictName, page) {
        return $http({
            method: 'GET',
            url: 'http://localhost:8080/api/posts/search',
            params: {
                searchTerm: searchTerm,
                district: selectedDistrictName,
                page: page
            }
        });
    };

    // Create a comment
    this.createComment = function (commentDTO) {
        return $http.post('http://localhost:8080/api/comments', commentDTO, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(response => response.data)
          .catch(error => {
              console.error('Error creating comment:', error);
              return null;
          });
    };

    // Delete a comment
    this.deleteComment = function (commentId, userId) {
        return $http.delete(`http://localhost:8080/api/comments/${commentId}`, {
            params: { userId: userId },
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(response => response.data)
          .catch(error => {
              console.error('Error deleting comment:', error);
              throw error; // Re-throw to handle it in the controller
          });
    };

    // Fetch comments by post ID
    this.getCommentsByPostId = function (postId, page, size) {
        return $http.get(`http://localhost:8080/api/comments/post/${postId}`, {
            params: { page: page, size: size }
        }).then(response => response.data)
          .catch(error => {
              console.error('Error fetching comments for post:', error);
              return [];
          });
    };

    // Submit a report
    this.submitReport = function (reportData) {
        return $http.post('http://localhost:8080/api/reports', reportData, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(response => response.data)
          .catch(error => {
              console.error('Error submitting report:', error);
              throw error;
          });
    };

    // Check if the post is favorited by the user
    this.checkFavoriteStatus = function (userId, postId) {
        return $http.get('http://localhost:8080/api/favorites/check', {
            headers: { 'Authorization': `Bearer ${token}` },
            params: { userId: userId, postId: postId }
        });
    };

    // Toggle favorite status
    this.toggleFavorite = function (userId, postId) {
        return $http.post('http://localhost:8080/api/favorites/toggle', null, {
            headers: { 'Authorization': `Bearer ${token}` },
            params: { userId: userId, postId: postId }
        });
    };

    // Fetch related posts
    this.getPostsRelated = function (districtName, page, size) {
        return $http.get('http://localhost:8080/api/posts/related', {
            params: { districtName: districtName, page: page, size: size }
        }).then(response => response.data)
          .catch(error => {
              console.error('Error fetching related posts:', error);
          });
    };

}]);
