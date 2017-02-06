# Ionic-Ecommerce

##About
Ionic-Ecommerce is a project using the [Ionic Framework](http://ionicframework.com/) and [AngularJS](http://www.angularjs.org) to make a mobile frontend to an ecommerce store.  It can be deployed as a mobile site for an ecommerce store, or built into native iOS and Android apps which will access the products, account, login, logout, cart, and checkout functions of the ecommerce site.

Check out a demo here: https://ionic-ecommerce.herokuapp.com/app. The Spree server providing the backend api is at http://ionic-ecommerce.herokuapp.com and its repo is at https://github.com/cachrisman/ionic-ecommerce-server

##Libraries & Frameworks
- Ruby on Rails
- Spree Ecommerce
- Angular
- Ionic

##Installation
### Dependencies
You need to have the following items installed and working in order to use this project. Their installation is beyond the scope of this document.
- Git
- Ruby
- Node/NPM

###Backend
Run the following commands to install the backend server:
```
git clone https://github.com/cachrisman/ionic-ecommerce-server.git
cd ionic-ecommerce-server
bundle install
spree install -A
rake db:migrate
rails server
```
###Frontend
Run the following commands to install the frontend:
```
git clone https://github.com/cachrisman/ionic-ecommerce.git
cd ionic-ecommerce
npm install --save
bower install --save
```
Change the file `ionic-ecommerce/www/js/constants.js` to reflect your local environment.

Last, run the following command to show you a webpage simulating an iOS device running this app:
```
ionic serve -l
```
Or you can also emulate the app running on iOS if you have Xcode installed:
```
ionic emulate ios
```

## Documentation

## Future Direction
