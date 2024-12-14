// let app = angular.module('paymentApp', []);
// const token = localStorage.getItem('token');
app.service('PaymentService', function($http) {
    this.getPrices = function() {
        return $http.get('http://127.0.0.1:8080/api/prices/active', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    };

this.createPayment = function(priceId, postId) {
        if (postId == null || priceId == null) {
            console.error("postId or priceId is undefined. Please check your function call.");
            return Promise.resolve();
        }
        return $http({
            method: 'GET',
            url: `http://127.0.0.1:8080/api/vnpay/payment/${priceId}/${postId}`,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    };
});