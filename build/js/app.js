app = angular.module('app', ['templatescache', 'ngRoute', 'ngTouch'], function(){

});

app.config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {
		$routeProvider

			.when('/', {
				templateUrl: 'content.html',
				controller: 'main-controller'
			})

			.otherwise({
				redirectTo: '/'
			})
}])

app.controller('main-controller', function($scope){
	$scope.hello = "hello world";
})
