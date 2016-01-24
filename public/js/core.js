// public/core.js

// include ngRoute for all our routing needs
var webind = angular
	.module('webind', [
		'ngRoute', 
		'ngAnimate', 
		'LocalStorageModule'
	])

	.config(['localStorageServiceProvider', function(localStorageServiceProvider){
  		localStorageServiceProvider.setPrefix('ls');
	}]);

    // configure our routes
webind.config(function($routeProvider) {
	$routeProvider
			.when('/instances', {
                templateUrl : 'pages/instances.html',
                controller : 'mainController',
            })
	            .when('/prod', {
                templateUrl : 'pages/prod.html',
                controller : 'prodController',
            })
                .when('/', {
                templateUrl : 'pages/first.html',
            })
                .when('/last', {
                templateUrl : 'pages/last.html',
            })
	            .when('/cons', {
                templateUrl : 'pages/cons.html',
                controller : 'consController',
            })
});

webind.controller('mainController', function($scope, localStorageService) {

	var consInStore = localStorageService.get('cons');
	var prodInStore = localStorageService.get('prod');

	$scope.progressBar = 50;

	$scope.cons = consInStore || [];
	$scope.prod = prodInStore || [];

	$scope.sliderProd = $scope.prod.length;
	$scope.sliderCons = $scope.cons.length;

	$scope.$watch('cons', function () {
  		localStorageService.set('cons', $scope.cons);
	}, true);

	$scope.$watch('prod', function () {
		localStorageService.set('prod', $scope.prod);
	}, true);

	if($scope.cons == [])
		$scope.cons.push({'id':'cons1', 'name':'Consumer 1', 'startingTime':'0', 'size':'10','period':'1000','duration':'10000','provider':''});

	if($scope.prod == [])
		$scope.prod.push({'id':'prod1', 'name':'Producer 1', 'size':10, 'delay':1000,'techno':'soap-java'});



    $scope.onInstancesNext = function(nbCons, nbProd){

    	console.log("cons : " + nbCons);
    	console.log("prod : " + nbProd);

    	if(nbCons > $scope.cons.length) {
	    	for(var i = $scope.cons.length ; i < nbCons ; i++)
	        	$scope.cons.push({'id':'cons' + (i+1), 'name':'Consumer ' + (i+1), 'startingTime':'0', 'size':'10','period':'1000','duration':'10000','provider':''});
	    } else {
	    	$scope.cons.splice(nbCons);
	    }

	    if(nbProd > $scope.prod.length) {
	    	for(var i = $scope.prod.length ; i < nbProd ; i++)
	        	$scope.prod.push({'id':'prod' + (i+1), 'name':'Producer' + (i+1), 'size':10, 'delay':1000,'techno':'soap-java'});
	    } else {
	    	$scope.prod.splice(nbProd);
	    }

	    console.log($scope.cons);
	    console.log($scope.prod);
    }
});

webind.controller('prodController', function($scope, localStorageService) {
	var consInStore = localStorageService.get('cons');
	var prodInStore = localStorageService.get('prod');

	$scope.cons = consInStore || [];
	$scope.prod = prodInStore || [];

	$scope.$watch('cons', function () {
  		localStorageService.set('cons', $scope.cons);
	}, true);

	$scope.$watch('prod', function () {
		localStorageService.set('prod', $scope.prod);
	}, true);
});

webind.controller('consController', function($scope, localStorageService) {
	var consInStore = localStorageService.get('cons');
	var prodInStore = localStorageService.get('prod');

	$scope.cons = consInStore || [];
	$scope.prod = prodInStore || [];

	$scope.$watch('cons', function () {
  		localStorageService.set('cons', $scope.cons);
	}, true);

	$scope.$watch('prod', function () {
		localStorageService.set('prod', $scope.prod);
	}, true);
});






