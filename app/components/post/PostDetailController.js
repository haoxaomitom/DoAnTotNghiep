app.controller('PostController', ['$scope', '$location', '$sce', '$window', 'PostDetailService', 'ItemService', function ($scope, $location, $sce, $window, PostDetailService, ItemService) {
    $scope.post = {};
    $scope.user = {};
    $scope.relatedPosts = [];
    $scope.comments = [];
    $scope.errorMessage = '';
    $scope.showPhone = false;
    $scope.commentsPage = 0;
    $scope.commentsSize = 5;
    $scope.totalCommentsPages = 0;
    $scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.totalPagesCount = 0;
    $scope.loading = false;
    $scope.isFavorite = false;
    $scope.isLiked = false;
    $scope.toastMessage = '';

    // Extract post ID from URL
    const params = new URLSearchParams(window.location.search);
    const id_post = params.get('id');

    const userId = localStorage.getItem('userId');
    if (userId) {
        $scope.userId = parseInt(userId, 10);
    }
    console.log('Extracted id_post:', id_post);

    // Function to get the post by ID
    $scope.getPostById = function (id_post) {
        $scope.loading = true;  // Set loading to true when fetching data
        PostDetailService.getPostById(id_post).then(function (data) {
            if (data) {
                $scope.post = data;
                $scope.user = data.user;
                $scope.loading = false;
                $scope.map = {
                    src: $sce.trustAsResourceUrl("https://www.google.com/maps/embed/v1/place?key=AIzaSyDaqWzB_IIAlUg3Iwp8yFfgjIIFhhMF0IQ&language=vi&q=" + $scope.post.latitude + "," + $scope.post.longitude)
                };
                if ($scope.post.districtName) {
                    $scope.getPostsByDistrict();
                } else {
                    console.error('District name is undefined for the post');
                }

            } else {
                $scope.errorMessage = 'Post not found';
                $scope.loading = false;
            }
        }).catch(function (error) {
            console.error('Error fetching post:', error);
            $scope.loading = false;  // Ensure loading is set to false even if there’s an error
        });
    };

    $scope.modalImage = null; // Lưu URL ảnh hiển thị trong Modal

    $scope.openModal = function (imageUrl) {
        $scope.modalImage = imageUrl; // Gán URL ảnh vào biến modalImage
        const modal = new bootstrap.Modal(document.getElementById('imageModal')); // Khởi tạo Bootstrap Modal
        modal.show(); // Hiển thị Modal
    };

    $scope.isPostPromoted = function (topPostEnd) {
        // Check if topPostEnd exists and is still valid
        return topPostEnd && new Date(topPostEnd) > new Date();
    };

    // Function to format amount as Vietnamese currency
    $scope.formatCurrency = function (amount) {
        if (amount != null) {
            return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
        return "0 VND";
    };

    // Hàm lấy bài viết liên quan theo quận
    $scope.getPostsByDistrict = function () {
        if ($scope.post.districtName) {
            PostDetailService.getPostsRelated($scope.post.districtName, $scope.currentPage, $scope.pageSize)
                .then(function (response) {
                    if (response && response.content) {
                        // Lọc bài viết loại trừ bài viết hiện tại
                        $scope.relatedPosts = response.content.filter(relatedPost => relatedPost.postId !== $scope.post.postId);
                        $scope.totalPagesCount = response.totalPages;
                    } else {
                        console.error('Unexpected response structure:', response);
                    }
                })
                .catch(function (error) {
                    console.error('Error fetching related posts:', error);
                });
        }
    };


    // Go to the next page
    $scope.nextPage = function () {
        if ($scope.currentPage < $scope.totalPagesCount - 1) {
            $scope.currentPage++;
            $scope.getPostsByDistrict();
            console.log("next");
        }
    };

    // Go to the previous page
    $scope.previousPage = function () {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
            $scope.getPostsByDistrict();
            console.log("previous");
        }
    };

    $scope.formatTimeAgo = function (date) {
        let now = new Date();
        let createdAt = new Date(date);
        let timeDiff = Math.floor((now - createdAt) / 1000);

        if (isNaN(timeDiff)) return "Invalid time";

        if (timeDiff < 60) return timeDiff + " giây trước";
        if (timeDiff < 3600) return Math.floor(timeDiff / 60) + " phút trước";
        if (timeDiff < 86400) return Math.floor(timeDiff / 3600) + " giờ trước";
        return Math.floor(timeDiff / 86400) + " ngày trước";
    };

    // Initialize the newComment object
    $scope.newComment = {
        user: userId, // Use the assigned user ID
        post: id_post, // Use the extracted post ID
        commentContent: '' // Initialize with an empty string
    };

    // Function to load comments by post ID
    $scope.loadComments = function () {
        PostDetailService.getCommentsByPostId(id_post, $scope.commentsPage, $scope.commentsSize)
            .then(function (response) { // Changed from data to response for clarity
                if (response && Array.isArray(response.content)) {
                    // Nếu có bình luận mới, thêm chúng vào danh sách hiện tại
                    if ($scope.commentsPage === 0) {
                        // Nếu là lần đầu tiên tải bình luận, gán lại danh sách
                        $scope.comments = response.content;
                    } else {
                        // Nếu đã tải trước đó, gộp nội dung mới vào
                        $scope.comments = $scope.comments.concat(response.content);
                    }
                    // Set totalCommentsPages based on response
                    $scope.totalCommentsPages = response.totalPages || 0;
                } else {
                    console.error("Unexpected response structure: ", response);
                    $scope.comments = []; // Set to an empty array if no comments found
                }
            })
            .catch(function (error) {
                console.error("Error fetching comments: ", error);
                $scope.comments = []; // Set to an empty array on error
            });
    };

    // Hàm tải thêm bình luận
    $scope.loadMoreComments = function () {
        if ($scope.commentsPage < $scope.totalCommentsPages - 1) {
            $scope.commentsPage++;
            $scope.loadComments(); // Tải thêm bình luận
        }
    };

    $scope.checkLoginBeforeSubmit = function () {
        if (!$scope.isLoggedIn()) {
            // Show modal if not logged in
            $('#loginPromptModal').modal('show');
        } else {
            // If logged in, proceed with submitting the comment
            $scope.submitComment();
        }
    };


    // Function to create a comment
    $scope.submitComment = function () {
        PostDetailService.createComment($scope.newComment).then(function (createdComment) {
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

    // Delete comment
    $scope.deleteComment = function (commentId) {
        return PostDetailService.deleteComment(commentId, userId)  // Ensure it returns the promise
            .then(function () {
                $scope.comments = $scope.comments.filter(comment => comment.commentId !== commentId);
                $('#deleteCommentModal').modal('hide'); // Close the modal after deletion
            })
            .catch(function (error) {
                console.error('Error deleting comment:', error);
                alert("Đã xảy ra lỗi khi xóa bình luận.");
            });
    };


    $scope.commentIdToDelete = null;

    $scope.confirmDeleteComment = function () {
        if ($scope.commentIdToDelete) {
            $scope.deleteComment($scope.commentIdToDelete).then(function () {
                $scope.commentIdToDelete = null; // Reset ID sau khi xóa
                $scope.showToast('Bình luận đã được xóa thành công!');
            });
        }
    };

    $scope.openDeleteModal = function (commentId) {
        // Save comment ID to delete
        $scope.commentIdToDelete = commentId;
        // Show delete confirmation modal
        $('#deleteCommentModal').modal('show');
    };

    $scope.openDeleteModal = function (commentId) {
        // Save comment ID to delete
        $scope.commentIdToDelete = commentId;
        // Show delete confirmation modal
        $('#deleteCommentModal').modal('show');
    };



    $scope.shareOnFacebook = function (postId) {
        // const url = `http://127.0.0.1:5500/app/components/post/PostDetail.html?id=${postId}`;
        const url = $location.absUrl();
        const facebookShareURL = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        window.open(facebookShareURL, '_blank', 'width=600,height=400');
    };

    $scope.copyLink = function () {
        // Get the current URL
        const url = $location.absUrl();

        // Copy to clipboard
        navigator.clipboard.writeText(url)
            .then(() => {
                // Show a toast message on successful copy
                $scope.showToast("Liên kết đã được sao chép!");
                $scope.$apply(); // Apply scope changes manually if needed
            })
            .catch((error) => {
                console.error("Không thể sao chép liên kết: ", error);
                $scope.showToast("Đã xảy ra lỗi khi sao chép liên kết.");
            });
    };


    $scope.generateQRCode = function () {
        const url = $location.absUrl(); // Lấy URL hiện tại
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(url)}&size=200x200`;

        // Tạo thẻ img để hiển thị mã QR
        const qrCodeImage = document.createElement('img');
        qrCodeImage.src = qrCodeUrl;
        qrCodeImage.alt = 'QR Code';
        qrCodeImage.style.marginTop = '20px'; // Thêm khoảng cách cho đẹp mắt

        // Xóa mã QR cũ nếu có
        const qrCodeContainer = document.getElementById('qrCodeContainer');

        if (qrCodeContainer) { // Check if the container exists
            qrCodeContainer.innerHTML = ''; // Xóa nội dung cũ
            qrCodeContainer.appendChild(qrCodeImage); // Thêm mã QR mới vào container
            $scope.loading = false;
        } else {
            console.error("QR Code container not found!");
        }
    };

    $scope.isOtherReason = false;

    $scope.checkReportReason = function () {
        $scope.isOtherReason = ($scope.reportReason === 'Khác');
    };

    $scope.submitReport = function () {
        const reportReason = $scope.reportReason;
        const reportDetails = $scope.reportDetails || '';

        if (reportReason && (reportReason !== 'Khác' || reportDetails)) {
            // Create an object for the report
            const reportData = {
                reportType: reportReason,
                reportContent: reportDetails,
                post: id_post,
                user: userId
            };

            // Call your API service to submit the report
            PostDetailService.submitReport(reportData).then(function (response) {
                $('#reportModal').modal('hide'); // Close the modal
                $scope.showToast('Báo cáo đã được gửi thành công!');

                $scope.reportReason = '';
                $scope.reportDetails = '';
            }).catch(function (error) {
                console.error('Error submitting report:', error);
                $scope.showToast('Đã xảy ra lỗi khi gửi báo cáo.');
            });
        } else {
            $scope.showToast('Vui lòng điền đầy đủ thông tin báo cáo.');
        }
    };


    $scope.checkFavoriteStatus = function () {
        PostDetailService.checkFavoriteStatus(userId, id_post)
            .then(function (response) {
                $scope.isFavorite = response.data.data || false; // Defaults to false if no data
            })
            .catch(function (error) {
                console.error("Lỗi khi kiểm tra trạng thái yêu thích:", error);
                $scope.isFavorite = false; // Default to false if there's an error
            });
    };

    // Function to check if user is logged in
    $scope.isLoggedIn = function () {
        const userId = localStorage.getItem('userId');  // Assuming userId is saved in localStorage
        return userId !== null; // If userId exists in localStorage, the user is logged in
    };

    // Toggle favorite status
    $scope.toggleFavorite = function () {
        if (!$scope.isLoggedIn()) {
            // If the user is not logged in, show the modal
            $('#loginPromptModal').modal('show');
            return;
        }

        // If the user is logged in, proceed with toggling the favorite status
        PostDetailService.toggleFavorite(userId, id_post)
            .then(function (response) {
                $scope.isFavorite = response.data.data.isFavorite;
                const actionMessage = $scope.isFavorite ? 'Đã lưu bài đăng' : 'Đã hủy lưu bài đăng';
                $scope.showToast(actionMessage);
            })
            .catch(function (error) {
                console.error("Lỗi khi thay đổi trạng thái yêu thích:", error);
                $scope.showToast('Lỗi khi thay đổi trạng thái yêu thích');
            });
    };


    $scope.saveContactInfo = function () {
        const data = {
            user: userId,
            post: id_post,
            phoneNumber: $scope.phoneNumber,
            typeCar: $scope.typeCar,
            contactTime: $scope.contactTime,
            description: $scope.description
        };

        console.log(data);

        PostDetailService.saveContactInfo(data).then((response) => {
            if (response.data.status) {
                $scope.showToast("Đã gửi thông tin thành công !");
                $('#leaveInfModal').modal('hide'); // Close the modal

            } else {
                alert(response.data.message);
                $scope.showToast("Có lỗi khi gửi thông tin, vui lòng thử lại sau !");
            }
        }).catch((err) => {
            console.error(err);
        });
    };

    // Show success toast
    $scope.showToast = function (message) {
        $scope.toastMessage = message;
        const toastElement = document.getElementById('toast');
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
    };


    $scope.getPostById(id_post);
    $scope.checkFavoriteStatus();
    $scope.loadComments();
    $scope.generateQRCode();
}]);
