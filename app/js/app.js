var app = angular.module('cncApp', ['ngRoute', 'ngAnimate']);

app.constant('CNC_API_CONFIG', {
	BASE: 'http://api.geonames.org',
	USER: 'angelarrr',
	METHOD: 'JSONP',
	CALLBACK: 'JSON_CALLBACK',
	COUNTRY_EP: '/countryInfoJSON',
	CAPITAL_EP: '/searchJSON',
	NEIGHBORS_EP: '/neighboursJSON',
	TIMEZONE_EP: '/timezoneJSON'
})

app.run(function($rootScope, $location, $timeout) {
	$rootScope.$on('$routeChangeError', function() {
		$location.path("/");
	});
	$rootScope.$on('$routeChangeStart', function() {
		$rootScope.isLoading = true;
	});
	$rootScope.$on('$routeChangeSuccess', function() {
		$timeout(function() {
			$rootScope.isLoading = false;
		}, 2000);
	});
})

app.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/', {
		templateUrl : './home/home.html',
		controller: "",
	}).when('/countries', {
		templateUrl : './countries/countries.html',
		controller : 'listCtrl',
	}).when('/countries/:countryCode/capital', {
		templateUrl : './countries/country-details.html',
		controller : 'detailsCtrl',
		resolve: {
			countryCode: function($route) {
				var countryCode = $route.current.params.countryCode;
				return countryCode;
			}
		}
	}).otherwise({
		redirectTo: '/'
	});
}])

app.factory('getCountries', function($http, $q, CNC_API_CONFIG){
	return function(endpoint, queryParams){
		var apiParams = {
			username: CNC_API_CONFIG.USER,
			callback: CNC_API_CONFIG.CALLBACK
		};
		return $http({
			method: CNC_API_CONFIG.METHOD,
			url: CNC_API_CONFIG.BASE + endpoint,
			params: angular.extend(apiParams, queryParams),
			timeout: 5000,
			cache: true
		});
	};
})

app.factory('getCountry', function($http, CNC_API_CONFIG, getCountries){
	return function(countryCode){
		var queryParams = {
			country: countryCode
		};
		return getCountries(CNC_API_CONFIG.COUNTRY_EP, queryParams)
			.then(function(countryDetails){
				if(countryCode){
					return countryDetails.data.geonames[0];
				} else {
					return countryDetails.data.geonames;
				}
		});
	};
})

app.factory('getCapital', function($http, CNC_API_CONFIG, getCountries){
	return function(countryCode){
		var queryParams = {
			country: countryCode,
			// isNameRequired: true,
			// formatted: true,
			// maxRows: 1,
		};

		return getCountries(CNC_API_CONFIG.CAPITAL_EP, queryParams)
			.then(function(capitalDetails){
				return capitalDetails.data.geonames[0];
			});
	};
})

app.factory('getNeighbors', function($http, CNC_API_CONFIG, getCountries){
	return function(countryCode){
		var queryParams = {
			country: countryCode
		};
		return getCountries(CNC_API_CONFIG.NEIGHBORS_EP, queryParams)
			.then(function(neighbors){
				return neighbors.data.geonames;
			});
	};
})

app.factory('getTimeZone', function($http, CNC_API_CONFIG, getCountries){
	return function(latitude, longitude){
		var queryParams = {
			lat: latitude,
			lng: longitude
		};
		return getCountries(CNC_API_CONFIG.TIMEZONE_EP, queryParams)
			.then(function(timezoneInfo){
				return timezoneInfo.data;
			});
	};
})

app.controller('listCtrl', function($scope, getCountry){
	getCountry().then(function(result){
		$scope.countries = result;
	});
})

app.controller('detailsCtrl', function($scope, countryCode, getCountry, getCapital, getNeighbors, getTimeZone){

	var loadCountry = function(){
		return getCountry(countryCode).then(function(countryDetails){
			$scope.countryDetails = countryDetails;
			return countryDetails;
		});
	};

	var loadCapital = function(){
		return getCapital(countryCode).then(function(capitalDetails){
			$scope.capitalDetails = capitalDetails;
			return capitalDetails;
		});
	};

	var loadNeighbors = function(){
		return getNeighbors(countryCode).then(function(neighbors){
			$scope.neighbors = neighbors;
			return neighbors;
		});
	};

	var loadTimezone = function(capitalDetails){
		return getTimeZone(capitalDetails.lat, capitalDetails.lng).then(function(timezoneDetails){
			$scope.timezoneDetails = timezoneDetails;
			return timezoneDetails;
		});
	};

	$scope.countryCode = countryCode;

	loadCountry();
	loadCapital().then(loadTimezone);
	loadNeighbors(countryCode);
})

// http://api.geonames.org/countryInfo?username=angelarrr