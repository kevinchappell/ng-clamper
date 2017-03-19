/*
ng-clamper - git@github.com:kevinchappell/ng-clamper.git
Version: 0.1.0
Author: Kevin Chappell <kevin.b.chappell@gmail.com>
*/
angular.module('ng-clamper', [])

.directive('ngClamper', function ngClamper() {
  'use strict';

  return {
    scope: {
      ngModel: '=ngModel',
      text: '=text'
    },
    restrict: 'C',
    controller: 'ClamperController as clamper'
  };
})

.controller('ClamperController', function ClamperController($scope, $element, $timeout, $window) {
  'use strict';

  /*eslint angular/controller-as-vm: [2,"clamper"]*/

  var clamper = this,
    scope = $scope;

  // strTruncate will shorten a string to a given length.
  // If substr cuts a word, it will find the last space and cut from there to respect word boundary.
  clamper.strTruncate = function(text, n, end) {
    var trim = text.length > n,
      str = trim ? text.substr(0, n - 1) : text,
      truncated = str.substring(0, Math.min(str.length, str.lastIndexOf(' ')));
    return truncated + end;
  };

  function getText(){
    return scope.ngModel.text || scope.text || $element[0].textContent;
  }

  function setupClamper() {
    scope.text = getText();
    scope.ngModel.curClamp = scope.ngModel.clamp;

    // is it necessary to watch the clamp settings?
    scope.$watch('ngModel', function(newVal, oldVal){
      if (newVal.clamp !== oldVal.clamp) {
        scope.ngModel.curClamp = newVal.clamp;
      }
      updateClamp();
    }, true);

    function updateClamp() {
      var text = scope.text;
      var end = scope.ngModel.end || '&hellip;',
        maxLines = parseInt(scope.ngModel.curClamp, 10),
        lineHeight = $window.getComputedStyle($element[0], null).getPropertyValue('line-height').replace('px', ''),
        clampHeight = function() {
          return {
            current: $element[0].clientHeight || $element[0].offsetHeight,
            closed: lineHeight * parseInt(scope.ngModel.curClamp, 10)
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
            $element[0].innerHTML = clamper.strTruncate(text, i, end);
          }
        };

      if (!text) {
        return;
      }

      $element[0].innerHTML = text;

      if (!scope.ngModel.clamped) {
        scope.ngModel.clamped = shouldClamp();
      }

      trimLoop(text);

      if (scope.ngModel.clamped) {
        $element.css({ 'max-height': '999px', 'overflow': 'auto' });
      } else {
        $element.css({ 'max-height': clampHeight().closed + 'px', 'overflow': 'hidden' });
      }
    }

    $element.bind('click', function() {
      scope.$apply(doToggle);
    });

    function doToggle() {
      if (scope.ngModel.clamped) {
        scope.ngModel.curClamp = 1000;
      } else {
        scope.ngModel.curClamp = scope.ngModel.clamp;
      }

      scope.ngModel.clamped = !scope.ngModel.clamped;
    }
  }

  $timeout(setupClamper, 0);
});
