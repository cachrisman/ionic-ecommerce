angular.module('ionic-ecommerce', ['ionic', 'ionic-ecommerce.controllers', 'ionic-ecommerce.services'])
.run(Runner)
.config(Configurator);

Runner.$inject = ['$ionicPlatform'];
function Runner($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
}

Configurator.$inject = ['$httpProvider', '$stateProvider', '$urlRouterProvider'];
function Configurator($httpProvider, $stateProvider, $urlRouterProvider) {

  $httpProvider.defaults.withCredentials = true;
  $httpProvider.defaults.headers.common["X-CSRF-Token"] = $("meta[name=csrf-token]").attr("content");
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/json';

  $urlRouterProvider.otherwise('/');

  $stateProvider

  .state('app', {
    url: '',
    abstract: true,
    templateUrl: 'templates/tabs.html',
    controller: 'TabCtrl as tabs'
  })

  .state('home', {
    url: '/',
    parent: 'app',
    views: {
      'home': {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl as home'
      }
    }
  })

  .state('products', {
    url: '/products',
    parent: 'app',
    views: {
      'products': {
        templateUrl: 'templates/products.html',
        controller: 'ProductsCtrl as products'
      }
    }
  })

  .state('products-detail', {
    url: '/products/:slug',
    parent: 'app',
    views: {
      'products': {
        templateUrl: 'templates/products.detail.html',
        controller: 'ProductDetailCtrl as product'
      }
    }
  })

  .state('cart', {
    url: '/cart',
    parent: 'app',
    views: {
      'cart': {
        templateUrl: 'templates/cart.html',
        controller: 'CartCtrl as cart'
      }
    }
  })

  .state('account', {
    url: '/account',
    parent: 'app',
    views: {
      'account': {
        templateUrl: 'templates/account.html',
        controller: 'AccountCtrl as account'
      }
    }
  })

  .state('login', {
    url: '/account/login',
    parent: 'app',
    views: {
      'account': {
        templateUrl: 'templates/account.login.html',
        controller: 'LoginCtrl as login'
      }
    }
  });
}
