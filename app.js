let app = angular.module('ParkingApp', ['ngRoute', 'ngSanitize']);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        //Post
        .when('/', {
            templateUrl: 'app/components/post/Post.html',
            controller: 'ParkingController'
        })
        .when('/post-detail', {
            templateUrl: '/app/components/post/PostDetail.html',
            controller: 'PostController'
        })
        .when('/dang-tin', {
            templateUrl: 'app/components/uppost/CreatePost.html',
            controller: 'UpPostController'
        })
        .when('/update-post', {
            templateUrl: 'app/components/uppost/UpdatePost.html',
            controller: 'UpdatePostController'
        })

        //Login
        .when('/Login-and-Register', {
            templateUrl: 'app/components/Login/LoginAndRegister.html',
            controller: 'LoginController'
        })

        // User
        .when('/user/save-post', {
            templateUrl: 'app/components/user/FavoritePost.html',
            controller: 'FavoritesController'
        })
        .when('/user/information', {
            templateUrl: 'app/components/user/DetailUser.html',
            controller: 'detailUserController'
        })
        .when('/user/my-post', {
            templateUrl: 'app/components/user/YourPost.html',
            controller: 'PostsController'
        })
        .when('/user/change-password', {
            templateUrl: 'app/components/user/ChangePassword.html',
            controller: 'ChangePasswordController'
        })
        .when('/user/payment', {
            templateUrl: 'app/components/user/Payment.html',
            controller: 'userPaymentController'
        })

        //Payment
        .when('/payment', {
            templateUrl: 'app/components/payment/VNPay.html',
            controller: 'PaymentController'
        })

        .otherwise({
            redirectTo: '/'
        });

    $locationProvider.html5Mode(true);
}]);