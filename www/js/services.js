angular.module('ionic-ecommerce.services', [])
.service('AuthService', AuthService)
.factory('ProductService', ProductService)
.factory('CartService', CartService);

// Auth Service
AuthService.$inject = ['$q', '$http'];
function AuthService($q, $http) {
  var LOCAL_TOKEN_KEY = 'ionic-ecommerce-api-key';
  var isAuthenticated = false;
  var authToken;

  function loadUserCredentials() {
    var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
    if (token) {
      useCredentials(token);
    }
  }

  function storeUserCredentials(token) {
    window.localStorage.setItem(LOCAL_TOKEN_KEY, token);
    useCredentials(token);
  }

  function useCredentials(token) {
    isAuthenticated = true;
    authToken = token;

    // Set the token as header for your requests!
    $http.defaults.headers.common['X-Spree-Token'] = token;
  }

  function destroyUserCredentials() {
    authToken = undefined;
    isAuthenticated = false;
    $http.defaults.headers.common['X-Spree-Token'] = undefined;
    window.localStorage.removeItem(LOCAL_TOKEN_KEY);
  }

  var login = function(email, password) {
    var endpoint = "http://localhost:3000/api/login.json";
    var deferred = $q.defer();
    var promise = deferred.promise;
    var params = { email: email, password: password };
    $http
      .post(endpoint, params)
      .success(function(response) {
        storeUserCredentials(response.token);
        deferred.resolve(response);
      })
      .error(function(rejection) { deferred.reject(rejection); });

    promise.success = function (callback) {
      promise.then(callback);
      return promise;
    };
    promise.error = function (callback) {
      promise.then(null, callback);
      return promise;
    };
    return promise;
  };

  var logout = function() {
    destroyUserCredentials();
  };

  loadUserCredentials();

  return {
    login: login,
    logout: logout,
    token: function() {return authToken;},
    isAuthenticated: function() {return isAuthenticated;}
  };
}

// Product Service
ProductService.$inject = ['$http', '$q', 'AuthService'];
function ProductService($http, $q, AuthService) {
  var service = this;
  var endpoint = "http://localhost:3000/api/products";
  service.all = all;
  service.get = get;

  function all() {
    var deferred = $q.defer();
    $http
      .get(endpoint, { cache: true })
      .success(function(response) {
        deferred.resolve(response);
      })
      .error(function(rejection) {
        deferred.reject(rejection);
      });
    return deferred.promise;
  }

  function get(id) {
    var deferred = $q.defer();
    $http
      .get(endpoint + "/" + id, { cache: true })
      .success(function(response) {
        deferred.resolve(response);
      })
      .error(function(rejection) {
        deferred.reject(rejection);
      });
    return deferred.promise;
  }
  return service;
}

// Cart Service
CartService.$inject = ['$http', '$q', 'ProductService'];
function CartService($http, $q, ProductService) {
  var service = this;
  service.products = {};
  service.count = 0;
  service.add = add;
  service.remove = remove;

  function add(product) {
    console.log("add product: ", product);
    service.products.push(ProductService.get(product));
    service.count = service.products.length;
  }

  function remove(product) {
    console.log("remove product: ", product);
  }

  return service;
}
