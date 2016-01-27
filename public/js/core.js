// public/core.js

// include ngRoute for all our routing needs
var webind = angular
	.module('webind', [
		'ngRoute', 
		'ngAnimate', 
		'LocalStorageModule',
		'chart.js'
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
                controller : 'lastController',
            })
	        
	        .when('/cons', {
                templateUrl : 'pages/cons.html',
                controller : 'consController',
            })

            .when('/results', {
                templateUrl : 'pages/results.html',
                controller : 'resultsController'
            });
});

webind.controller('mainController', function($scope) {

});

webind.controller('instancesController', function($scope, localStorageService) {

	var consInStore = localStorageService.get('cons');
	var prodInStore = localStorageService.get('prod');

	$scope.progressBar = 50;

	$scope.cons = consInStore || [];
	$scope.prod = prodInStore || [];


	$scope.$watch('cons', function () {
  		localStorageService.set('cons', $scope.cons);
	}, true);

	$scope.$watch('prod', function () {
		localStorageService.set('prod', $scope.prod);
	}, true);

	if($scope.cons.length < 1)
		$scope.cons.push({'id':1, 'name':'Consumer 1', 'startingTime':0, 'size':10,'period':1000,'duration':10000,'provider':'1'});

	if($scope.prod.length < 1)
		$scope.prod.push({'id':1, 'name':'Provider 1', 'size':10, 'delay':1000});


	$scope.sliderProd = $scope.prod.length;
	$scope.sliderCons = $scope.cons.length;

    $scope.onInstancesNext = function(nbCons, nbProd){

    	console.log("cons : " + nbCons);
    	console.log("prod : " + nbProd);

    	if(nbCons > $scope.cons.length) {
	    	for(var i = $scope.cons.length ; i < nbCons ; i++)
	        	$scope.cons.push({'id':(i+1), 'name':'Consumer ' + (i+1), 'startingTime':0, 'size':10,'period':1000,'duration':10000,'provider':'1'});
	    } else {
	    	$scope.cons.splice(nbCons);
	    }

	    if(nbProd > $scope.prod.length) {
	    	for(var i = $scope.prod.length ; i < nbProd ; i++)
	        	$scope.prod.push({'id':(i+1), 'name':'Provider ' + (i+1), 'size':10, 'delay':1000});
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

webind.controller('consController', function($scope, $http, $interval, localStorageService) {
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

webind.controller('lastController', function($scope, $http, $interval, localStorageService) {

	var consInStore = localStorageService.get('cons');
	var prodInStore = localStorageService.get('prod');

	$scope.cons = consInStore || [];
	$scope.prod = prodInStore || [];

	var req1 = {
 			method: 'POST',
 			url: '/api/scenario',
 			headers: {
   				'Content-Type': 'Application/json'
 			},
 			data: { 'providers': $scope.prod, 'consumers': $scope.cons}
		}

    	$http(req1)
            .success(function(data){
            	console.log(data);
            	$scope.endTime = (data.endTime / 1000) | 0;
				startTimer(askForResults);
            })
            .error(function(data){
                console.log('Error: ' + data);
            });

    function startTimer(callback) {
    	var timer = $interval(function(){
    		if($scope.endTime > 0) {
    			$scope.endTime--;
    			/* document.querySelector('#p3').addEventListener('mdl-componentupgraded', function() {
    				this.MaterialProgress.setProgress(33);
    				this.MaterialProgress.setBuffer(87);
  				}); */
    		} else {
    			callback();
    			$interval.cancel(timer);
    		}
  		},1000);
    }

    function askForResults() {
    	var req2 = {
 			method: 'GET',
 			url: '/api/results'
 		}

    	$http(req2)
            .success(function(data){
            	console.log(data);
            	localStorageService.set('data', data);
            })
            .error(function(data){
                console.log('Error: '+ data);
            });
    }
});

webind.controller('resultsController', function($scope) {

	var dataInStore = localStorageService.get('data');

	$scope.data = dataInStore || [];

	if($scope.data.length > 0) {
		$scope.timeScale = [];
		for(var i = 0 ; i < $scope.data.intervals.length ; i++)
			$scope.timeScale.push(i+1)
		$scope.series = ['Consumer 1', 'Consumer 2'];
	    $scope.data = [[3, 4, 5, 2, 8, 8, 7, 6, 4, 5],[5, 4, 6, 7, 8, 8, 2, 5, 4, 3]];
	}

});







