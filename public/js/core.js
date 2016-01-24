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
webind.config(function($routeProvider, $locationProvider) {
	$routeProvider
	        .when('/', {
                templateUrl : 'pages/first.html',
                controller : 'mainController',
            })

			.when('/instances', {
                templateUrl : 'pages/instances.html',
                controller : 'instancesController',
            })

	        .when('/prod', {
                templateUrl : 'pages/prod.html',
                controller : 'prodController',
            })
            
            .when('/last', {
                templateUrl : 'pages/last.html',
            })
	        
	        .when('/cons', {
                templateUrl : 'pages/cons.html',
                controller : 'consController',
            });

	// use the HTML5 History API
    $locationProvider.html5Mode(true);
});

webind.controller('mainController', function($scope) {

});

webind.controller('instancesController', function($scope, localStorageService) {

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
		$scope.cons.push({'id':'1', 'name':'Consumer 1', 'startingTime':'0', 'size':'10','period':'1000','duration':'10000','provider':''});

	if($scope.prod == [])
		$scope.prod.push({'id':'1', 'name':'Producer 1', 'size':10, 'delay':1000,'techno':'soap-java'});



    $scope.onInstancesNext = function(nbCons, nbProd){

    	console.log("cons : " + nbCons);
    	console.log("prod : " + nbProd);

    	if(nbCons > $scope.cons.length) {
	    	for(var i = $scope.cons.length ; i < nbCons ; i++)
	        	$scope.cons.push({'id':(i+1), 'name':'Consumer ' + (i+1), 'startingTime':'0', 'size':'10','period':'1000','duration':'10000','provider':''});
	    } else {
	    	$scope.cons.splice(nbCons);
	    }

	    if(nbProd > $scope.prod.length) {
	    	for(var i = $scope.prod.length ; i < nbProd ; i++)
	        	$scope.prod.push({'id':(i+1), 'name':'Producer' + (i+1), 'size':10, 'delay':1000,'techno':'soap-java'});
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

webind.controller('consController', function($scope, $http, localStorageService) {
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

	$scope.onLaunchClick = function(){

		var req = {
 			method: 'POST',
 			url: '/api/scenario',
 			headers: {
   				'Content-Type': 'Application/json'
 			},
 			data: { 'providers': $scope.prod, 'consumers': $scope.cons}
		}

		console.log(req);

    	$http(req)
            .success(function(data){
				console.log(data);
            })
            .error(function(data){
                console.log('Error: '+data);
            });
    }

    $scope.onSaveClick = function() {

    	var data = { 'providers': $scope.prod, 'consumers': $scope.cons}
		
		data = JSON.stringify(data, undefined, 2);

		var blob = new Blob([data], {type: 'text/json'}),
			e = document.createEvent('MouseEvents'),
			a = document.createElement('a');

			a.download = "scenario.json";
			a.href = window.URL.createObjectURL(blob);
			a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
			e.initMouseEvent('click', true, false, window,
			  0, 0, 0, 0, 0, false, false, false, false, 0, null);
			a.dispatchEvent(e);
	};
});







