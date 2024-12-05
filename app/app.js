let app = angular.module('ParkingApp', ['ngRoute', 'ngSanitize']);
let app = angular.module('ParkingApp', ['ngRoute', 'ngSanitize']);

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: 'app/components/post/Post.html',
            controller: 'ParkingController'
        })
        .when('/post-detail', {
            templateUrl: 'app/components/post/PostDetail.html',
            controller: 'PostController'
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

        //Payment
        .when('/payment', {
            templateUrl: 'app/components/payment/VNPay.html',
            controller: 'PaymentController'
        })

        .otherwise({
            redirectTo: '/home'
        });

    $locationProvider.html5Mode(true);
}]);
app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: 'app/components/post/Post.html',
            controller: 'ParkingController'
        })
        .when('/post-detail', {
            templateUrl: 'app/components/post/PostDetail.html',
            controller: 'PostController'
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

        //Payment
        .when('/payment', {
            templateUrl: 'app/components/payment/VNPay.html',
            controller: 'PaymentController'
        })

        .otherwise({
            redirectTo: '/home'
        });

    $locationProvider.html5Mode(true);
}]);