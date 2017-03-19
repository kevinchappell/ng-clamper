'use strict';

angular.module('app', [
	'ngSanitize',
  'ng-clamper'
])

.controller('AppController', ['$rootScope', '$scope', function AppCtrl($rootScope, $scope) {
	var app = this;
	app.loaded = true;
	app.author = 'Kevin Chappell';
	app.clampSize = 3;
	app.introClamp = {
		clamp: app.clampSize,
		toggle: true,
		end: '&hellip;'
	};

	$scope.$watch('app.clampSize', function(){
		app.introClamp.clamp = app.clampSize;
	});
}]);
