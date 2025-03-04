
app.controller('ParkingController', ['$scope', '$http','$window', '$location', 'ItemService', 'LocationService', 'PostService', function ($scope, $http, $window, $location, ItemService, LocationService, PostService) {

    $scope.loading = false;
    $scope.posts = [];
    $scope.searchTerm = '';
    $scope.currentPage = 0; // Start from the first page
    $scope.pageSize = 5; // Number of posts per page
    $scope.totalPagesCount = 0; // Total pages returned from the API
    $scope.notFoundMessage = '';
    $scope.sortPrice = '';
    $scope.isLoggedIn = false;
    $scope.user = {};
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    $scope.hasUnreadNotifications = false;

        // Chờ tải xong tất cả tài nguyên
        angular.element(document).ready(function () {
            $scope.$applyAsync(() => {
                $scope.isLoading = false; // Đảm bảo trạng thái này thực sự được cập nhật
            });
        });
        
    // Kiểm tra trạng thái đăng nhập khi khởi tạo controller
    $scope.checkLoginStatus = function () {
        if (token && username) {
            $scope.isLoggedIn = true;
            $http.get(`http://localhost:8080/api/users/getUserByUsername?username=${username}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            }).then(function (response) {
                $scope.$applyAsync(() => {  // Ensures Angular detects the update
                    $scope.user = response.data; // Save the user data in $scope.user
                });
            }).catch(function (error) {
                console.error('Error fetching user data:', error);
            });
        } else {
            $scope.isLoggedIn = false;
        }
    };

    $scope.isLoggedIn = function() {
        const userId = localStorage.getItem('userId');  // Assuming userId is stored in localStorage
        return userId !== null; // If userId exists, the user is logged in
    };

    $scope.checkLoginBeforePost = function() {
        if (userId == null) {
            // Show modal if not logged in
            $('#loginPromptModal').modal('show');
        } else {
            // If the user is logged in, redirect to the post page
            $location.path('/dang-tin');  // Change the URL based on your app's routing
        }
    };
    
    $scope.redirectToLogin = function () {
        // Hide modal and redirect to login page
        $('#loginPromptModal').modal('hide');
        localStorage.setItem('redirectUrl', $location.path());  // Store current URL to redirect after login
        $location.path('/Login-and-Register');  // Change this URL based on your app's routing
    };
    
    $scope.logout = function () {
        // Lưu URL hiện tại
        const currentPath = $location.path();
        
        // Xóa token và userId trong localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        
        // Đổi trạng thái đăng nhập
        $scope.isLoggedIn = false;
        $scope.user = {};
        
        // Chuyển hướng về lại trang hiện tại
        $location.path(currentPath); 
    };
    

    // Fetch posts with pagination
    $scope.getPosts = function () {
        $scope.loading = true;
        if ($scope.sortPrice) {
            $scope.sortPosts();
        } else {
            ItemService.getPosts($scope.currentPage, $scope.pageSize).then(function (response) {
                $scope.posts = response.data.content;
                $scope.totalPagesCount = response.data.totalPages;
                $scope.loading = false;
            }).catch(function (error) {
                $scope.loading = false;
                console.error('Error fetching posts:', error);
            });
        }
    };

    $scope.isPostPromoted = function (topPostEnd) {
        // Check if topPostEnd exists and is still valid
        return topPostEnd && new Date(topPostEnd) > new Date();
    };

    // Go to the next page
    $scope.nextPage = function () {
        if ($scope.currentPage < $scope.totalPagesCount - 1) {
            $scope.currentPage++;
            $scope.getPosts();
            $scope.getPosts();
        }
    };

    // Go to the previous page
    $scope.previousPage = function () {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
            $scope.getPosts();
            $scope.getPosts();
        }
    };

    // Function to format amount as Vietnamese currency
    $scope.formatCurrency = function (amount) {
        if (amount != null) {
            return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
        return "0 VND";
    };

    // Fetch provinces and set default selections
    $scope.getProvinces = function () {
        LocationService.getProvinces().then(function (response) {
            $scope.provinces = response.data;

            // Set TP HCM
            $scope.selectedProvince = $scope.provinces.find(province => province.Name === "Thành phố Hồ Chí Minh");
            if ($scope.selectedProvince) {
                // Update districts when TP HCM is selected
                $scope.updateDistricts();
            }
        }).catch(function (error) {
            console.error('Error loading data:', error);
        });
    };

    $scope.updateDistricts = function () {
        if ($scope.selectedProvince) {
            $scope.districts = $scope.selectedProvince.Districts;
        } else {
            $scope.districts = []; // No province selected
        }
    };

    // Search posts based on search term and selected district
    $scope.searchPosts = function () {
        if (!$scope.searchTerm || $scope.searchTerm.trim() === '') {
            // Nếu ô tìm kiếm trống, gọi lại getPosts để tải tất cả bài đăng
            $scope.notFoundMessage = ''; // Xóa thông báo lỗi nếu có
            $scope.getPosts();
        } else {
            // Nếu có từ khóa tìm kiếm, gọi phương thức tìm kiếm
            PostService.searchPosts($scope.searchTerm.trim(), $scope.selectedDistrict ? $scope.selectedDistrict.Name : null, $scope.currentPage)
                .then(function (response) {
                    const posts = response.data.content || []; // Get the content from the response
    
                    // Check if posts array is empty
                    if (posts.length === 0) {
                        $scope.notFoundMessage = 'Không tìm thấy kết quả nào'; // Set not found message
                        $scope.posts = []; // Clear posts if no data found
                    } else {
                        $scope.notFoundMessage = ''; // Clear the not found message if results are found
                        $scope.posts = posts; // Update posts list with search results
                    }
                })
                .catch(function (error) {
                    console.error('Error fetching posts:', error);
                    $scope.notFoundMessage = 'Đã xảy ra lỗi khi tìm kiếm. Vui lòng thử lại.'; // Set an error message
                    $scope.posts = []; // Clear posts on error
                });
        }
    };
    
    // Load the count of posts by district  
    $scope.loadDistrictPostCounts = function () {
        PostService.getPostsCountByDistrict().then(function (response) {
            $scope.districtPostCounts = response.data;
        }).catch(function (error) {
            console.error('Error loading district post counts:', error);
        });
    };

    $scope.onDistrictChange = function () {
        $scope.selectedVehicleType = ""; // Reset dropdown loại xe
        $scope.sortPrice = "";           // Reset dropdown sắp xếp

        if ($scope.selectedDistrict && $scope.selectedDistrict.Name) {
            PostService.searchPosts($scope.selectedDistrict.Name, $scope.currentPage)
                .then(function (response) {
                    const posts = response.data.content || [];
                    if (posts.length === 0) {
                        $scope.notFoundMessage = 'Không tìm thấy kết quả nào';
                        $scope.posts = [];
                    } else {
                        $scope.notFoundMessage = '';  // Clear message if there are results
                        $scope.posts = posts;
                    }
                    $scope.totalPagesCount = response.data.totalPages;
                })
                .catch(function (error) {
                    console.error('Error fetching posts:', error);
                });
        } else {
            $scope.notFoundMessage = '';
            $scope.getPosts();
        }
    };


    $scope.sortPosts = function () {
        $scope.loading = true;
        PostService.sortPostsByPrice($scope.sortPrice, $scope.currentPage, $scope.pageSize).then(function (response) {
            $scope.posts = response.data.content;
            $scope.totalPagesCount = response.data.totalPages;
            $scope.loading = false;
        }).catch(function (error) {
            $scope.loading = false;
            console.error('Error fetching sorted posts:', error);
        });
    };

    $scope.onVehicleTypeChange = function () {
        $scope.selectedDistrict = ""; // Reset dropdown quận/huyện
        $scope.sortPrice = "";          // Reset dropdown sắp xếp

        if ($scope.selectedVehicleType) {
            PostService.searchPostsByVehicleType($scope.selectedVehicleType, $scope.currentPage)
                .then(function (response) {
                    const posts = response.data.content || [];
                    if (posts.length === 0) {
                        $scope.notFoundMessage = 'Không tìm thấy kết quả nào';  // Set message if no results
                        $scope.posts = [];
                    } else {
                        $scope.notFoundMessage = '';  // Clear message if there are results
                        $scope.posts = posts;
                    }
                    $scope.totalPagesCount = response.data.totalPages;
                })
                .catch(function (error) {
                    console.error('Error fetching posts:', error);
                });
        } else {
            $scope.notFoundMessage = '';
            $scope.getPosts();
        }
    };

    $scope.getByIsRead = function (isRead) {
        $http.get(`http://localhost:8080/api/notifications/getAllByGlobalAndUserAndIsRead?userId=${userId}&isRead=${isRead}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then((response) => {
                console.log("check status noti");
                if (response.data.status) {
                    $scope.notifications = response.data.data;
                    // Kiểm tra nếu có thông báo chưa đọc
                    $scope.hasUnreadNotifications = $scope.notifications.some(noti => !noti.isRead);
                } else {
                    console.log(response.data.message);
                }
            }).catch((err) => {
                console.log(err);
            });
    };
console.log($scope.hasUnreadNotifications);
    // Sorting function triggered when the user selects a sort option
    $scope.onSortChange = function () {
        $scope.selectedDistrict = ""; // Reset dropdown quận/huyện
        $scope.selectedVehicleType = ""; // Reset dropdown loại xe

        $scope.currentPage = 0; // Reset về trang đầu tiên
        $scope.getPosts();
    };


    // Format time function
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

    $scope.$on('$routeChangeSuccess', function () {
        // Hiển thị sidebar cho các đường dẫn bắt đầu với '/user/'
        $scope.showSidebar = $location.path().startsWith('/user/');
    });

   
    $scope.checkLoginStatus();
    $scope.getPosts();
    $scope.getProvinces();
    $scope.loadDistrictPostCounts();

}]);
