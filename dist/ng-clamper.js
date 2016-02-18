/*
ng-clamper - git@github.com:kevinchappell/ng-clamper.git
Version: 0.0.1
Author: Kevin Chappell <kevin.b.chappell@gmail.com>
*/
angular.module('ng-clamper', [])

.directive('ngClamper', function ngClamper() {
  'use strict';

  return {
    scope: {
      ngModel: '=clamper',
      text: '='
    },
    restrict: 'C',
    controller: 'clamperCtrl as clamper'
  };
})

.controller('clamperCtrl', function ($scope, $element) {
  'use strict';

  var clamper = this,
    element = $element,
    scope = $scope;

  // strTruncate will shorten a string to a given length.
  // If substr cuts a word, it will find the last space and cut from there to respect word boundary.
  clamper.strTruncate = function (text, n, end) {
    var trim = text.length > n,
      str = trim ? text.substr(0, n - 1) : text,
      truncated = str.substring(0, Math.min(str.length, str.lastIndexOf(' ')));
    return truncated + end;
  };

  scope.ngModel.clamped = false;

  // is it necessary to watch the clamp settings?
  scope.$watch('ngModel.clamp', updateClamp);

  // clamp should update whenever target text changes
  scope.$watch('text', updateClamp);

  function updateClamp() {
    var text = scope.text,
      end = scope.ngModel.end || '&hellip;',
      maxLines = parseInt(scope.ngModel.clamp, 10),
      lineHeight = window.getComputedStyle(element[0], null).getPropertyValue('line-height').replace('px', ''),
      clampHeight = function () {
        return {
          current: element[0].clientHeight || element[0].offsetHeight,
          closed: lineHeight * parseInt(scope.ngModel.clamp, 10)
        };
      },
      lines = function () {
        return Math.max(Math.ceil(clampHeight().current / lineHeight), 0);
      },
      shouldClamp = function () {
        return lines() > maxLines;
      },
      trimLoop = function (text) {
        for (var i = text.length - 1; shouldClamp(); i--) {
          element[0].innerHTML = clamper.strTruncate(text, i, end);
        }
      };

    if (!text) {
    	return;
    }

    element[0].innerHTML = text;
    if (scope.ngModel.clamped === false) {
      scope.ngModel.clamped = shouldClamp();
    }

    trimLoop(text);

    if (scope.ngModel.clampOpen) {
      element.css('max-height', '999px');
    } else {
      element.css('max-height', clampHeight().closed + 'px');
    }
  }

})

.directive('clampToggle', function () {
	'use strict' ;

  return {
    restrict: 'E',
    scope: {
      ngModel: '='
    },
    controller: 'clampToggleCtrl as clampToggle'
  };
})

.controller('clampToggleCtrl', function ($scope, $element) {
	'use strict';

  var element = $element,
	    scope = $scope;

  element.bind('click', function () {
    scope.$apply(doToggle);
  });

  function doToggle() {
    if (!scope.ngModel.clampOpen) {
      scope.ngModel.clamp = scope.ngModel.maxClamp;
    } else {
      scope.ngModel.clamp = scope.ngModel.clampTo;
    }
    scope.ngModel.clampOpen = !scope.ngModel.clampOpen;

  }
})

;
