'use strict';

// Declare app level module which depends on views, and components
angular.module('rentfinds', [
  'ngRoute',
  'rentfinds.rentals',
  'firebase'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/rentals'});
}]);
