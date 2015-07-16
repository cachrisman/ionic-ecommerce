angular.module('ionic-ecommerce')

.constant('$ionicLoadingConfig', {
  template: '<ion-spinner></ion-spinner>',
  // template: '<ion-spinner class="spinner-positive"></ion-spinner>',
  noBackdrop: false,
})

.constant('CONFIG', {
  // api_login_uri: "http://localhost:3000/api/login.json",
  // api_products_uri: "http://localhost:3000/api/products",
  // image_root: "http://localhost:3000",
  // localStorage_token_key: "ionic-ecommerce-api-key-localhost",

  api_login_uri: "https://ionic-ecommerce.herokuapp.com/api/login.json",
  api_products_uri: "https://ionic-ecommerce.herokuapp.com/api/products",
  image_root: "https://ionic-ecommerce.herokuapp.com",
  localStorage_token_key: "ionic-ecommerce-api-key-heroku",

  timeout: 10, // how many seconds before remote http requests should be considered timed out?
  token_header: "X-Spree-Token"
});
