describe('Line Clamp Directive', function() {
  'use strict';

  var scope,
    lineClamp,
    mockTimeout,
    html = '<span mj-clamp>This is a long test string.</span>';


  beforeEach(module('app.components.line-clamp'));
  beforeEach(module('app.common.spec-helper'));

  beforeEach(inject(function($rootScope, $controller, _SpecHelper_) {
    var SpecHelper = _SpecHelper_;
    mockTimeout = angular.noop;

    scope = $rootScope.$new();
    scope.ngModel = {
      text: 'This is a long test string.',
      end: '&hellip;'
    };

    lineClamp = $controller('lineClampCtrl', {
      $scope: scope,
      $element: angular.element(html),
      $timeout: mockTimeout
    });

  }));

  describe('truncate string', function() {

    it('should truncate the string', function() {
      var text = scope.ngModel.text;
      expect(text.length).toEqual(27);
      text = lineClamp.strTruncate(text, 10, scope.ngModel.end);
      expect(text.length).toEqual(15);
    });
  });

});
