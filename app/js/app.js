var app = angular.module('cncApp', ['ngRoute', 'ngAnimate']);

var app = angular.module('cncApp', ['ngRoute', 
	'ngAnimate']);

app.constant('CNC_API_CONFIG', {
	BASE: 'http://api.geonames.org',
	USER: 'angelarrr'
	METHOD: 'JSONP',
	CALLBACK: 'JSON_CALLBACK',
	COUNTRY_EP: '/countryInfoJSON',
	CAPITAL_EP: 'searchJSON',
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
	}).when('/countries/:country/capital', {
		templateUrl : './country-details.html',
		controller : 'detailsCtrl',
		resolve: {
			country: function($route, $location) {
				var country = $route.current.params.country;
				return country;
			},
			countryCode: function($route, $location) {
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
		var params = {
			username: CNC_API_CONFIG.USER,
			callback: CNC_API_CONFIG.CALLBACK
		};
		return $http({
			method: CNC_API_CONFIG.METHOD,
			url: CNC_API_CONFIG.BASE + endpoint,
			params: angular.extend(params, queryParams),
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
			isNameRequired: true,
			formatted: true,
			maxRows: 1,
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
			.then(function(timezone){
				return timezone.data;
			});
	};
})

app.controller('listCtrl', ['$scope', 'countryFactory', function($scope, countryFactory) {
	countryFactory.getCountries().then(function(countries){
		$scope.countries = countries;
	})
}])

app.controller('detailCtrl', ['$scope', '$q', 'storeCountries', function($scope, $q, storeCountries) {
	// from resolved route
	$scope.country = country;
	$scope.countryCode = countryCode;
	
	var loadCountry = function() {
		return countryFactory.getCountry(countryCode, country).then(function(country){
			$scope.countryPop = country.population;
			$scope.countryArea = country.areaInSqKm;
			$scope.countryCapital = country.capital;
		});
	},
	loadCapital = function() {
		return countryFactory.getCapital(countryCode).then(function(capital){
			$scope.capitalPop = capital.population;
		});
	},
	loadNeighbors = function() {
		return countryFactory.getNeighbors(countryCode).then(function(neighbors){
			$scope.neighbors = neighbors;
			$scope.neighborsCount = neighbors.length;
		});
	};
}])

// http://api.geonames.org/countryInfo?username=angelarrr