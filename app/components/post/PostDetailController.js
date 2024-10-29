app.controller('PostController', ['$scope', '$location','$sce', 'PostService', 'ItemService', function ($scope, $location, $sce, PostService, ItemService) {
    $scope.post = {};
    $scope.user = {};
    $scope.errorMessage = '';
    $scope.showPhone = false;
    $scope.relatedPosts = [];
    $scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.totalPagesCount = 0;
    $scope.loading = false;

    $scope.totalCommentsPages = 0;

    $scope.commentsPage = 0;
    $scope.commentsSize = 5;
    $scope.comments = [];


    // Assign a user ID for testing
    $scope.currentUserId = 1;

    // Extract post ID from URL
    const params = new URLSearchParams(window.location.search);
    const id_post = params.get('id');
    console.log('Extracted id_post:', id_post);

    // Function to get the post by ID
    $scope.getPostById = function (id_post) {
        $scope.loading = true;  // Set loading to true when fetching data
        PostService.getPostById(id_post).then(function (data) {
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
  


    // Hàm lấy bài viết liên quan theo quận
    $scope.getPostsByDistrict = function () {
        if ($scope.post.districtName) {
            ItemService.getPosts($scope.post.districtName, $scope.currentPage, $scope.pageSize)
                .then(function (response) {
                    if (response && response.content) {
                        $scope.relatedPosts = response.content;
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
        user: $scope.currentUserId, // Use the assigned user ID
        post: id_post, // Use the extracted post ID
        commentContent: '' // Initialize with an empty string
    };

    // Function to load comments by post ID
    $scope.loadComments = function () {
        PostService.getCommentsByPostId(id_post, $scope.commentsPage, $scope.commentsSize)
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

    $scope.copyLink = function () {
        // Lấy URL hiện tại
        const url = $location.absUrl();

        // Sao chép vào clipboard
        navigator.clipboard.writeText(url)
            .then(() => {
                // Hiện thông báo khi sao chép thành công
                alert("Liên kết đã được sao chép!");
            })
            .catch((error) => {
                console.error("Không thể sao chép liên kết: ", error);
                alert("Đã xảy ra lỗi khi sao chép liên kết.");
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
        const reportDetails = $scope.reportDetails || ''; // Defaults to empty if not filled

        if (reportReason && (reportReason !== 'Khác' || reportDetails)) {
            // Create an object for the report
            const reportData = {
                reportType: reportReason,
                reportContent: reportDetails,
                post: id_post, // Assuming you have the post ID available
                user: $scope.currentUserId // Assuming you have the current user ID available
            };

            // Call your API service to submit the report
            PostService.submitReport(reportData).then(function (response) {
                // Handle success (show a message, reset form, etc.)
                alert('Báo cáo đã được gửi thành công!');
                $('#reportModal').modal('hide'); // Close the modal
                $scope.reportReason = '';
                $scope.reportDetails = '';
            }).catch(function (error) {
                console.error('Error submitting report:', error);
                alert('Đã xảy ra lỗi khi gửi báo cáo.');
            });
        } else {
            alert('Vui lòng điền đầy đủ thông tin báo cáo.');
        }
    };


    $scope.getPostById(id_post);
    $scope.loadComments();
    $scope.generateQRCode();

    // Call Google Map when the data is ready
    // google.charts.load("current", {
    //     "packages": ["map"],
    //     "mapsApiKey": "AIzaSyDaqWzB_IIAlUg3Iwp8yFfgjIIFhhMF0IQ"
    // });

    // google.charts.setOnLoadCallback(function() {
    //     drawChart($scope.post.latitude, $scope.post.longitude, $scope.post.parkingName);
    // });

    // // Function to draw the chart
    // function drawChart(lat, long, name) {
    //     var data = google.visualization.arrayToDataTable([
    //         ['Lat', 'Long', 'Name'],
    //         [lat, long, name]
    //     ]);

    //     var map = new google.visualization.Map(document.getElementById('map_div'));
    //     map.draw(data, {
    //         showTooltip: true,
    //         showInfoWindow: true
    //     });
    // }
}]);
