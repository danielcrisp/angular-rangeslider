describe('Range Slider', function() {
  var $scope, $compile;

  beforeEach(module('ui-rangeSlider'));

  beforeEach(inject(function($rootScope, _$compile_) {
    $scope = $rootScope.$new();
    $compile = _$compile_;
  }));

  function compileDirective(template, scope) {
    var elm = angular.element(template);
    $compile(elm)(scope);
    scope.$apply();
    return elm;
  }

  it('compiles', function() {
    var elm = compileDirective('<div range-slider min="0" max="100" model-min="min" model-max="max"></div>', $scope);
  })
});
