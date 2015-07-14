var AuthService = function($q, $http) {
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
    $http.defaults.headers.common['X-Auth-Token'] = token;
  }

  function destroyUserCredentials() {
    authToken = undefined;
    isAuthenticated = false;
    $http.defaults.headers.common['X-Auth-Token'] = undefined;
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
};

AuthService.$inject = ['$q', '$http'];

var ProductService = function($http, $q, AuthService) {
  var endpoint = "http://localhost:3000/api/products";
  var ProductService = {};
  ProductService.cache = {};
  ProductService.all = function(refresh) {
    refresh = typeof refresh !== 'undefined' ? refresh : false;
    if (ProductService.cache.all === undefined || refresh) {
      var deferred = $q.defer();
      $http
        .get(endpoint, {
          headers: {
            "X-Spree-Token": AuthService.token
          }
        })
        .success(function(response) {
          deferred.resolve(response);
        })
        .error(function(rejection) {
          deferred.reject(rejection);
        });
      return deferred.promise;
    } else {
      return ProductService.cache.all;
    }
  };
  ProductService.get = function(id, refresh) {
    refresh = typeof refresh !== 'undefined' ? refresh : false;
    if (ProductService.cache[id] === undefined || refresh) {
      var deferred = $q.defer();
      $http
        .get(endpoint + "/" + id, {
          headers: {
            "X-Spree-Token": AuthService.token
          }
        })
        .success(function(response) {
          ProductService.cache[id] = response;
          deferred.resolve(response);
        })
        .error(function(rejection) {
          deferred.reject(rejection);
        });
      return deferred.promise;
    } else {
      return ProductService.cache[id];
    }
  };
  return ProductService;
};

ProductService.$inject = ['$http', '$q', 'AuthService'];

angular.module('ionic-ecommerce.services', [])
.service('AuthService', AuthService)
.factory('ProductService', ProductService);
