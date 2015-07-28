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

// testing services
describe("appFactory", function(){

	beforeEach(module('cncApp'));

	beforeEach(inject(function(_$httpBackend_) {
		$httpBackend = _$httpBackend_;
	}));

	afterEach(function() {
		$httpBackend.verifyNoOutstandingRequest();
	});

	describe('getCountry', function(){

		it('should successfully request countries data',
			inject(function($httpBackend, getCountry){
				var response = 'an array of countries'
				$httpBackend.expectGET('http://api.geonames.org/countryInfoJSON?username=angelarrr').respond(response);

				getCountry().then(function(data){
					$rootScope.digest();
					$httpBackend.flush();
					expect(data).toBe('an array of countries');
				});
			}));
	});

	describe('getNeighbors', function(){
		it('should successfully request neighbors data',
			inject(function($httpBackend, getNeighbors){
				var response = 'an array of neighbors'
				$httpBackend.expectGET('http://api.geonames.org/neighboursJSON?&country=AR&username=angelarrr').respond(response);

				getNeighbors().then(function(data){
					$rootScope.digest();
					$httpBackend.flush();
					expect(data).toBe('an array of neighbors');
				});
			}));
	});
});