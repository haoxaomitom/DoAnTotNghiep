var app = angular.module('paymentApp', []);


app.service('PaymentService', function($http) {
    this.getPrices = function() {
        return $http.get('http://localhost:8080/api/prices'); // Thay đổi URL theo đúng API của bạn
    };

    this.createPayment = function(amount, orderInfo, postId, priceId) {
        return $http({
            method: 'GET', // Change to GET since your endpoint expects a GET request
            url: `http://127.0.0.1:8080/api/vnpay/payment/${priceId}`, // Use path variable for priceId
            params: {
                amount: amount,
                paymentInfo: orderInfo,
                postId: postId
            }
        });
    }; 
});
