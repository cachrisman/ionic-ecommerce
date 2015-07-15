angular.module('ionic-ecommerce.controllers', [])
.controller('HomeCtrl', HomeCtrl)
.controller('ProductsCtrl', ProductsCtrl)
.controller('ProductDetailCtrl', ProductDetailCtrl)
.controller('CartCtrl', CartCtrl)
.controller('AccountCtrl', AccountCtrl)
.controller('LoginCtrl', LoginCtrl);

// Home Controller
HomeCtrl.$inject = [];
function HomeCtrl() {}

//Products Controller
ProductsCtrl.$inject = ['$scope', 'ProductService'];
function ProductsCtrl($scope, ProductService) {
  var vm = this;
  ProductService.all()
  .then(function(response) {
      vm.all = response.products;
    },
    function(rejection) {
      console.log("ProductsCtrl Products.all error: " + rejection.error);
    });
}

// Product Detail Controller
ProductDetailCtrl.$inject = ['$scope', '$stateParams', 'ProductService', 'CartService'];
function ProductDetailCtrl($scope, $stateParams, ProductService, CartService) {
  var vm = this;
  var id = $stateParams.productId;
  vm.add = add;

  ProductService.get(id)
  .then(function(response) {
      vm.name = response.name;
      vm.price = response.price;
      vm.description = response.description;
      vm.image = response.master.images[0].product_url;
      vm.product = response;
      console.log(vm.product);
    },
    function(rejection) {
      console.log("ProductDetailCtrl Products.get error: " + rejection.error);
    });

  function add(product) {
    CartService.add(product);
  }
}

// Cart Controller
CartCtrl.$inject = ['$scope', '$stateParams', 'CartService'];
function CartCtrl($scope, $stateParams, CartService) {
  var vm = this;
  vm.cart = CartService.products;
  vm.remove = remove;

  function remove(product) {
    CartService.remove(product);
  }
}


// Account Controller
AccountCtrl.$inject = ['$scope', '$state', 'AuthService'];
function AccountCtrl($scope, $state, AuthService) {
  var vm = this;
  vm.logout = logout;

  $scope.$on('$ionicView.enter', function(e) {
    vm.logged_in = AuthService.isAuthenticated();
    vm.token = AuthService.token();
  });

  function logout() {
    AuthService.logout();
    vm.user = null;
    vm.token = null;
    vm.logged_in = AuthService.isAuthenticated();
    $state.reload('tab.account');
  }
}

// Login Controller
LoginCtrl.$inject = ['$scope', '$state', '$ionicPopup', 'AuthService'];
function LoginCtrl($scope, $state, $ionicPopup, AuthService) {
  var vm = this;
  vm.go = go;

  function go(user) {
    vm.user = null;
    console.log("hit login function");
    AuthService.login(user.email, user.password)
      .success(function(data) {
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
  }
}




