angular.module('ionic-ecommerce.controllers', [])
.controller('TabCtrl', TabCtrl)
.controller('HomeCtrl', HomeCtrl)
.controller('ProductsCtrl', ProductsCtrl)
.controller('ProductDetailCtrl', ProductDetailCtrl)
.controller('CartCtrl', CartCtrl)
.controller('AccountCtrl', AccountCtrl)
.controller('LoginCtrl', LoginCtrl);

// Tab Controller
TabCtrl.$inject = ['$scope', 'CartService'];
function TabCtrl(   $scope,   CartService) {
  var vm = this;
  vm.count = CartService.count();

  $scope.$watch(function(){ return CartService.count();}, function(current, original) {
    vm.count = current;
  });
}

// Home Controller
HomeCtrl.$inject = [];
function HomeCtrl() {}

//Products Controller
ProductsCtrl.$inject = ['$state', '$ionicLoading', '$ionicPopup', 'AuthService', 'ProductService', 'CONFIG'];
function ProductsCtrl(   $state,   $ionicLoading,   $ionicPopup,   AuthService,   ProductService,   CONFIG) {
  var vm = this;
  $ionicLoading.show();
  ProductService.all()
  .then(function(response) {
      vm.all = response.products;
      $ionicLoading.hide();
    },
    function(rejection) {
      console.log("ProductsCtrl Products.all error: " + rejection.error);
    });
}

// Product Detail Controller
ProductDetailCtrl.$inject = ['$stateParams', '$state', '$ionicLoading', '$ionicPopup' ,'CONFIG', 'AuthService', 'ProductService', 'CartService', ];
function ProductDetailCtrl(   $stateParams,   $state,   $ionicLoading,   $ionicPopup,   CONFIG,   AuthService,   ProductService,   CartService) {
  var vm = this;
  var id = $stateParams.productId;
  var slug = $stateParams.slug;
  vm.addToCart = addToCart;

  $ionicLoading.show();
  ProductService.get(id)
  .then(function(response) {
      vm.name = response.name;
      vm.price = response.price;
      vm.description = response.description;
      vm.image = response.master.images[0].product_url;
      vm.product = response;
      $ionicLoading.hide();
    },
    function(rejection) {
      console.log("ProductDetailCtrl Products.get error: " + rejection.error);
    });
    ProductService.get(slug)

  function addToCart(product) {
    CartService.add(product);
  }
}

// Cart Controller
CartCtrl.$inject = ['$scope', 'CartService', 'CONFIG'];
function CartCtrl(   $scope,   CartService,   CONFIG) {
  var vm = this;
  vm.products = CartService.products;
  vm.remove = remove;

  function remove(product) {
    CartService.remove(product);
  }
}


// Account Controller
AccountCtrl.$inject = ['$scope', '$state', 'AuthService'];
function AccountCtrl(   $scope,   $state,   AuthService) {
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
    $state.reload('account');
  }
}

// Login Controller
LoginCtrl.$inject = ['$state', '$ionicLoading', '$ionicPopup', 'AuthService'];
function LoginCtrl(   $state,   $ionicLoading,   $ionicPopup,   AuthService) {
  var vm = this;
  vm.go = go;

  function go(user) {
    vm.user = null;
    AuthService.login(user.email, user.password)
      .success(function(data) {
        console.log("successful login; token: " + data.token);
        $state.go('account', {}, {reload: true});
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




