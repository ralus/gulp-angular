'use strict';

module.exports = angular.module( 'project.home', [
  'ui.router',
  'plusOne'
])

.config(function ( $stateProvider ) {
  $stateProvider.state( 'home', {
    url: '/home',
    views: {
      "main": {
        controller: 'HomeCtrl',
        templateUrl: 'home/home.tpl.html'
      }
    },
    data:{ pageTitle: 'Home' }
  });
})

.controller( 'HomeCtrl', function ( $scope ) {
});