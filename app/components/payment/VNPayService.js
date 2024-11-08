var app = angular.module('paymentApp', []);


app.service('PaymentService', function($http) {
    this.getPrices = function() {
        return $http.get('http://localhost:8080/api/prices');
    };

    this.createPayment = function(priceId, postId) {
        if (postId == null || priceId == null) {
            console.error("postId or priceId is undefined. Please check your function call.");
            // Return an empty promise to avoid 'undefined' errors
            return Promise.resolve(); // or you can use $q.resolve() for compatibility
        }
        return $http({
            method: 'GET',
            url: `http://127.0.0.1:8080/api/vnpay/payment/${priceId}/${postId}`
        });
    };
    
});

