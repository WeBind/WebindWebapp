// public/core.js

// include ngRoute for all our routing needs
var webind = angular.module('webind', ['ngRoute', 'ngAnimate']);

    // configure our routes
webind.config(function($routeProvider) {
	$routeProvider
	            .when('/', {
                templateUrl : 'pages/instances.html',
            })
	            .when('/prod', {
                templateUrl : 'pages/prod.html',
            })
	            .when('/cons', {
                templateUrl : 'pages/cons.html',
            })
});

webind.controller('mainController', function($scope,$http,$rootScope) {

});
