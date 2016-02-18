angular.module('ng-clamper', [])

.directive('ngClamper', function ngClamper() {
  'use strict';

  return {
    scope: {
      ngModel: '=clamper',
      text: '=text'
    },
    restrict: 'C',
    controller: 'clamperCtrl as clamper'
  };
})

.controller('clamperCtrl', ['$scope', '$element', '$timeout', function clamperCtrl($scope, $element, $timeout) {
  'use strict';

  var clamper = this,
    element = $element,
    scope = $scope;

  var lineClamp = scope.ngModel.clamp;

  $timeout(function() {

    var text = scope.text || scope.ngModel.text || element.text();

    // strTruncate will shorten a string to a given length.
    // If substr cuts a word, it will find the last space and cut from there to respect word boundary.
    clamper.strTruncate = function(text, n, end) {
      var trim = text.length > n,
        str = trim ? text.substr(0, n - 1) : text,
        truncated = str.substring(0, Math.min(str.length, str.lastIndexOf(' ')));
      return truncated + end;
    };

    scope.ngModel.clamped = false;

    // is it necessary to watch the clamp settings?
    scope.$watch('ngModel', updateClamp, true);

    // clamp should update whenever target text changes
    scope.$watch('text', updateClamp);

    function updateClamp() {
      console.log('updateClamp');
      var end = scope.ngModel.end || '&hellip;',
        maxLines = parseInt(scope.ngModel.clamp, 10),
        lineHeight = window.getComputedStyle(element[0], null).getPropertyValue('line-height').replace('px', ''),
        clampHeight = function() {
          return {
            current: element[0].clientHeight || element[0].offsetHeight,
            closed: lineHeight * parseInt(scope.ngModel.clamp, 10)
          };
        },
        lines = function() {
          return Math.max(Math.ceil(clampHeight().current / lineHeight), 0);
        },
        shouldClamp = function() {
          return lines() > maxLines;
        },
        trimLoop = function(text) {
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

      if (scope.ngModel.clamped) {
        element.css({ 'max-height': '999px', 'overflow': 'auto' });
      } else {
        element.css({ 'max-height': clampHeight().closed + 'px', 'overflow': 'hidden' });
      }
    }

    element.bind('click', function() {
      scope.$apply(doToggle);
    });

    function doToggle() {
      if (scope.ngModel.clamped) {
        scope.ngModel.clamp = 1000;
      } else {
        scope.ngModel.clamp = lineClamp;
      }
      scope.ngModel.clamped = !scope.ngModel.clamped;
    }

  }, 0);

}])

;
