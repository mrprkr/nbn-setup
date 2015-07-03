app = angular.module('app', ['templatescache', 'ngRoute', 'ngTouch'], function(){

});

app.config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {
		$routeProvider

			.when('/', {
				templateUrl: 'content.html',
				controller: 'main-controller'
			})

			.when('/player/:connectionType', {
				templateUrl: 'video_player.html',
				controller: 'player-controller'
			})

			.otherwise({
				redirectTo: '/'
			})
}])

app.controller('main-controller', function($scope){
	$scope.hello = "hello world";
})

app.controller('player-controller', function($scope, $routeParams){
	$scope.connectionType = $routeParams.connectionType;
})