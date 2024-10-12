let app = angular.module('parkingApp', []);

app.controller('PostController', ['$scope', 'PostService', '$location', function($scope, PostService, $location) {
    $scope.post = {};
    $scope.errorMessage = '';
    $scope.showPhone = false; // Ẩn số điện thoại
    $scope.captchaVisible = false; // Ẩn reCAPTCHA ban đầu

    const params = new URLSearchParams(window.location.search);
    const id_post = params.get('id'); // This should give you the ID from the URL
    console.log('Extracted id_post:', id_post);

    // Function to get the post by ID
    $scope.getPostById = function(id_post) {
        PostService.getPostById(id_post).then(function(data) {
            if (data) {
                $scope.post = data;
            } else {
                $scope.errorMessage = 'Post not found';
            }
        });
    };

    // Call the function with the extracted id_post
    if (id_post) {
        $scope.getPostById(id_post);
    } else {
        $scope.errorMessage = 'Post ID is not defined';
    }

    $scope.verifyCaptcha = function() {
        // Hiện reCAPTCHA
        $scope.captchaVisible = true;

        // Lắng nghe sự kiện reCAPTCHA
        window.onCaptchaSuccess = function() {
            // Khi xác minh thành công
            $scope.$apply(function() {
                $scope.showPhone = true; // Hiển thị số điện thoại
            });
            grecaptcha.reset(); // Reset reCAPTCHA
        };

        // Đảm bảo rằng grecaptcha đã được khởi tạo
        if (typeof grecaptcha !== 'undefined') {
            grecaptcha.ready(function() {
                grecaptcha.execute('6Ld5GV8qAAAAAL6ciFlZljPr8QJbsikaZ5nS0-VW', {action: 'submit'}).then(function(token) {
                    onCaptchaSuccess();
                });
            });
        } else {
            console.error('grecaptcha is not available.');
        }
    };
}]);

// Đảm bảo rằng Google reCAPTCHA đã được tải
angular.element(document).ready(function() {
    // Khởi tạo reCAPTCHA nếu cần
    if (typeof grecaptcha !== 'undefined') {
        grecaptcha.render('your-recaptcha-element-id', {
            'sitekey': '6Ld5GV8qAAAAAL6ciFlZljPr8QJbsikaZ5nS0-VW'
        });
    }
});