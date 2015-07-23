var app = angular.module('cncApp', ['ngRoute', 'ngAnimate']);

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

app.factory('countryFactory', function($http, $q){
	
	var apiURL = "http://api.geonames.org/";
	var username = "angelarrr";
	var countryData = {};

	countryData = {
		getCountries: function() {
				var defer = $q.defer();
				var url = apiURL + "countryInfoJSON";
				var request = {
					callback: 'JSON_CALLBACK',
					username: username,
			};

			$http({
				method: 'JSONP',
				url: url,
				params: request,
				cache: true
			})

			.success(function(data, status) {
				defer.resolve(data);
			})

			.error(function(data) {
				defer.reject();
			});

			return defer.promise;
		},

		getCountry: function(countryCode) {
			var defer = $q.defer();
			var url = apiURL + "countryInfoJSON";
			var request = {
				callback: 'JSON_CALLBACK',
				country: countryCode,
				username: username
			};

			$http({
				method: 'JSONP',
				url: url,
				params: request,
				cache: true
			})

			.success(function(data){
				defer.resolve(data.geonames);
			})

			.error(function(data){
				defer.reject();
			});

			return defer.promise;
		},

		getCapital: function(countryCode) {
			var defer = $q.defer;
			var url = apiURL + "searchJSON";
			var request = {
				callback: 'JSON_CALLBACK',
				q: 'capital',
				country: countryCode,
				isNameRequired: true,
				formatted: true,
				maxRows: 1,
				username: username
			};

			$http({
				method: 'JSONP',
				url: url,
				params: request,
				cache: true
			})

			.success(function(data){
				defer.resolve(data.geonames[0]);
			})

			.error(function(data){
				defer.reject();
			});

			return defer.promise;
		},

		getNeighbors: function(countryCode) {
			var defer = $q.defer;
			var url = apiURL +  "neighboursJSON";
			var request = {
				callback: 'JSON_CALLBACK',
				country: countryCode,
				username: username
			};

			$http({
				method: 'JSONP',
				url: url,
				params: request,
				cache: true
			})
			.success(function(data){
				defer.resolve(data);
			})
			.error(function(data){
				defer.reject();
			});

			return defer.promise;
		}
	}

	return countryData;
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