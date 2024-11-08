
app.controller('CommentController', function ($scope, $window) {



    $scope.checkLoginBeforeSubmit = function () {
        const isLoggedIn = localStorage.getItem("token") && localStorage.getItem("userId");
        if (!isLoggedIn) {
            // Show modal if not logged in
            $('#loginPromptModal').modal('show');
        } else {
            // If logged in, proceed with submitting the comment
            $scope.submitComment();
        }
    };

    $scope.redirectToLogin = function () {
        // Hide modal and redirect to login page
        $('#loginPromptModal').modal('hide');
        $window.location.href = '/login';
    };

    // Function to create a comment
    $scope.submitComment = function () {
        PostService.createComment($scope.newComment).then(function (createdComment) {
            if (createdComment) {
                $scope.comments.push(createdComment); // Ensure createdComment has the correct structure
                $scope.newComment.commentContent = ''; // Clear comment content
            } else {
                alert("Không thể tạo bình luận.");
            }
        }).catch(function (error) {
            console.error("Error creating comment:", error);
            alert("Đã xảy ra lỗi khi tạo bình luận.");
        });
    };

    $scope.commentIdToDelete = null;

    $scope.confirmDeleteComment = function () {
        // Gọi hàm deleteComment với ID bình luận đã lưu
        if ($scope.commentIdToDelete) {
            $scope.deleteComment($scope.commentIdToDelete);
            $scope.commentIdToDelete = null; // Reset ID sau khi xóa
        }
    };

    $scope.openDeleteModal = function (commentId) {
        // Lưu ID bình luận vào biến
        $scope.commentIdToDelete = commentId;
        // Mở modal
        $('#deleteCommentModal').modal('show');
    };
    // Delete comment
    $scope.deleteComment = function (commentId) {
        PostService.deleteComment(commentId, $scope.currentUserId)
            .then(function () {
                // Remove the comment from the UI
                $scope.comments = $scope.comments.filter(comment => comment.commentId !== commentId);
                // Close the modal
                $('#deleteCommentModal').modal('hide');
                // Show feedback to the user
                alert("Bình luận đã được xóa!");
            })
            .catch(function (error) {
                console.error('Error deleting comment:', error);
                alert("Đã xảy ra lỗi khi xóa bình luận.");
            });


    };
});
