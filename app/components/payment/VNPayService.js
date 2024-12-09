// let app = angular.module('paymentApp', []);
// const token = localStorage.getItem('token');
app.service('PaymentService', function($http) {
    this.getPrices = function() {
        return $http.get('https://doantotnghiepbe-production.up.railway.app/api/prices', {
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
            url: `https://doantotnghiepbe-production.up.railway.app/api/vnpay/payment/${priceId}/${postId}`,
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
    };
});