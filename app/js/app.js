var app = angular.module('cncApp', ['ngRoute', 'ngAnimate']);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/', {
		templateUrl : './home/home.html',
		controller : 'cncCtrl'
	}).when('/countries', {
		templateUrl : './countries/countries.html',
		controller : 'listCtrl'
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
	}).otherwise('/');
}])

app.factory('countryData', [$'http', function($http){
	
	var apiURL = "http://api.geonames.org/";
	var username = "angelarrr";

	return {
		getCountries: function() {
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
		},

		getCountry: function(countryCode) {
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
		},

		getCapital: function(countryCode) {
			var url = apiURL + "searchJSON";
			var request = {
				callback: 'JSON_CALLBACK',
				q: 'capital',
				country: countryCode,
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
		},

		getNeighbors: function(countryCode) {
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
		}
	};
}])

app.controller('cncCtrl', function($scope) {

})

// http://api.geonames.org/countryInfo?username=angelarrr