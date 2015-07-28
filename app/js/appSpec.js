// testing routes
describe("/routes", function(){
	beforeEach(module('cncApp'));

	it('should load template, controller and call resolve',
		inject(function($route){
			expect($route.routes['/'].templateUrl).toBe('./home/home.html');

			expect($route.routes['/countries'].templateUrl).toBe('./countries/countries.html');
			expect($route.routes['/countries'].controller).toBe('listCtrl');

			expect($route.routes['/countries/:countryCode/capital'].templateUrl).toBe('./countries/country-details.html');
			expect($route.routes['/countries/:countryCode/capital'].controller).toBe('detailsCtrl');

			expect($route.routes[null].redirectTo).toBe('/');
		}));
});