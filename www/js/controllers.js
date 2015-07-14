// Home Controller
var HomeCtrl = function($scope) {};

HomeCtrl.$inject = ['$scope'];

//Products Controller
var ProductsCtrl = function($scope, ProductService) {
  $scope.products = function () {
    ProductService.all()
    .then(function(response) {
        return response.products;
      },
      function(rejection) {
        console.log("ProductsCtrl Products.all error: " + rejection.error);
      });
  };
};

ProductsCtrl.$inject = ['$scope', 'ProductService'];

// Product Detail Controller
var ProductDetailCtrl = function($scope, $stateParams, ProductService) {
  var id = $stateParams.productId;
  $scope.product = function(id) {
    ProductService.get(id).then(
      function(response) {
        return response;
      },
      function(rejection) {
        console.log("ProductDetailCtrl Products.get error: " + rejection.error);
      })();
  };
};

ProductDetailCtrl.$inject = ['$scope', '$stateParams', 'ProductService'];

// Cart Controller
var CartCtrl = function($scope, $stateParams) {};

CartCtrl.$inject = ['$scope', '$stateParams'];

// Account Controller
var AccountCtrl = function($scope, $state, AuthService) {
  $scope.$on('$ionicView.enter', function(e) {
    $scope.logged_in = AuthService.isAuthenticated();
    $scope.token = AuthService.token();
  });

  $scope.logout = function(){
    AuthService.logout();
    $scope.user = {};
    $scope.token = null;
    $scope.logged_in = AuthService.isAuthenticated();
    $state.reload('tab.account');
  };
};

AccountCtrl.$inject = ['$scope', '$state', 'AuthService'];

// Login Controller
var LoginCtrl = function($scope, $state, $ionicPopup, AuthService) {
  $scope.login = function(user) {
    AuthService.login(user.email, user.password)
      .success(function(data) {
        $scope.user = {};
        console.log("successful login; token: " + data.token);
        $state.go('tab.account', {}, {reload: true});
      })
      .error(function(data) {
        console.log("login failed", data.error);
        var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: data.error
        });
      });
  };
};

LoginCtrl.$inject = ['$scope', '$state', '$ionicPopup', 'AuthService'];

angular.module('ionic-ecommerce.controllers', [])
.controller('HomeCtrl', HomeCtrl)
.controller('ProductsCtrl', ProductsCtrl)
.controller('ProductDetailCtrl', ProductDetailCtrl)
.controller('CartCtrl', CartCtrl)
.controller('AccountCtrl', AccountCtrl)
.controller('LoginCtrl', LoginCtrl);
