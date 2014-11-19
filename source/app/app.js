'use strict';

require('./templates');
require('./home');
require('./about');

module.exports = angular.module( 'project', [
  'templates',
  'ui.router',
  'project.home',
  'project.about'
])

.config( function ( $stateProvider, $urlRouterProvider ) {
  $urlRouterProvider.otherwise( '/home' );
})

.controller( 'AppCtrl', function ( $scope, $location ) {
  $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
    if ( angular.isDefined( toState.data.pageTitle ) ) {
      $scope.pageTitle = toState.data.pageTitle + ' | ngBoilerplate' ;
    }
  });
});s