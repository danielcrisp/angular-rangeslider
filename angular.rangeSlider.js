/**
 *  Angular RangeSlider Directive
 * 
 *  Version: 0.0.2
 *
 *  Author: Daniel Crisp, danielcrisp.com
 *
 *  The rangeSlider has been styled to match the default styling
 *  of form elements styled using Twitter's Bootstrap
 * 
 *  Originally forked from https://github.com/leongersen/noUiSlider
 *
 */
(function () {
    'use strict';

    /**
     * RangeSlider, allows user to define a range of values using a slider
     * Touch friendly.
     * @directive
     */
    angular.module('ui-rangeSlider', [])
        .directive('rangeSlider', function($document, $filter, $log) {

        // test for mouse, pointer or touch
        var EVENT = window.navigator.msPointerEnabled ? 2 : 'ontouchend' in document ? 3 : 1,
            eventNamespace = '.rangeSlider',

            defaults = {
                disabled: false,
                orientation: 'horizontal',
                step: 0,
                decimalPlaces: 0,
                showValues: true
            },

            onEvent = (EVENT === 1 ? 'mousedown' : EVENT === 2 ? 'MSPointerDown' : 'touchstart') + eventNamespace + 'X',
            moveEvent = (EVENT === 1 ? 'mousemove' : EVENT === 2 ? 'MSPointerMove' : 'touchmove') + eventNamespace,
            offEvent = (EVENT === 1 ? 'mouseup' : EVENT === 2 ? 'MSPointerUp' : 'touchend') + eventNamespace,

            // get standarised clientX and clientY
            client = function (f) {
                try {
                    return [(f.clientX || f.originalEvent.clientX || f.originalEvent.touches[0].clientX), (f.clientY || f.originalEvent.clientY || f.originalEvent.touches[0].clientY)];
                } catch (e) {
                    return ['x', 'y'];
                }
            },

            restrict = function (value) {

                // normalize so it can't move out of bounds
                return (value < 0 ? 0 : (value > 100 ? 100 : value));

            },

            isNumber = function (n) {
               // console.log(n);
                return !isNaN(parseFloat(n)) && isFinite(n);
            };


        return {
            restrict: 'A',
            replace: true,
            template: ['<div class="range-slider">',
                         '<div class="runner">',
                           '<div class="handle handle-min"><i></i></div>',
                           '<div class="handle handle-max"><i></i></div>',
                           '<div class="join"></div>',
                         '</div>',
                         '<div class="value value-min" ng-show="showValues">{{filteredModelMin}}</div>',
                         '<div class="value value-max" ng-show="showValues">{{filteredModelMax}}</div>',
                       '</div>'].join(''),
            scope: {
                disabled: '=?',
                min: '=',
                max: '=',
                modelMin: '=',
                modelMax: '=',
                orientation: '@', // options: horizontal | vertical | vertical left | vertical right
                step: '@',
                decimalPlaces: '@',
                filter: '@',
                filterOptions: '@',
                showValues: '@'
            },
            link: function(scope, element, attrs, controller) {

                /** 
                 *  FIND ELEMENTS
                 */

                var $slider = angular.element(element),
                    handles = [element.find('.handle-min'), element.find('.handle-max')],
                    join = element.find('.join'),
                    pos = 'left',
                    posOpp = 'right',
                    orientation = 0,
                    allowedRange = [0, 0],
                    range = 0;

                // filtered
                scope.filteredModelMin = scope.modelMin;
                scope.filteredModelMax = scope.modelMax;

                /**
                 *  FALL BACK TO DEFAULTS FOR SOME ATTRIBUTES
                 */
                attrs.$observe('disabled', function (val) {
                    if (!angular.isDefined(val)) {
                        scope.disabled = defaults.disabled;
                    }

                    scope.$watch('disabled', setDisabledStatus);
                });

                attrs.$observe('orientation', function (val) {
                    if (!angular.isDefined(val)) {
                        scope.orientation = defaults.orientation;
                    }
                    // add class to element
                    $slider.addClass(scope.orientation);
                    // update pos
                    if (scope.orientation === 'vertical' || scope.orientation === 'vertical left' || scope.orientation === 'vertical right') {
                        pos = 'top';
                        posOpp = 'bottom';
                        orientation = 1;
                    }
                });

                attrs.$observe('step', function (val) {
                    if (!angular.isDefined(val)) {
                        scope.step = defaults.step;
                    }
                });

                attrs.$observe('decimalPlaces', function (val) {
                    if (!angular.isDefined(val)) {
                        scope.decimalPlaces = defaults.decimalPlaces;
                    }
                });

                attrs.$observe('showValues', function (val) {
                    if (!angular.isDefined(val)) {
                        scope.showValues = defaults.showValues;
                    } else {
                        if (val === 'false') {
                            scope.showValues = false;
                        } else {
                            scope.showValues = true;
                        }
                    }
                });


                // listen for changes to values
                scope.$watch('min', setMinMax);
                scope.$watch('max', setMinMax);

                scope.$watch('modelMin', setModelMinMax);
                scope.$watch('modelMax', setModelMinMax);

                /**
                 * HANDLE CHANGES
                 */

                function setDisabledStatus (status) {
                    if (status) {
                        $slider.addClass('disabled');
                    } else {
                        $slider.removeClass('disabled');
                    }
                }

                function setMinMax () {

                    if (scope.min > scope.max) {
                        throwError("min must be less than or equal to max");
                    }

                    // only do stuff when both values are ready
                    if (angular.isDefined(scope.min) && angular.isDefined(scope.max)) {

                        // make sure they are numbers
                        if (!isNumber(scope.min)) {
                            throwError("min must be a number");
                        }
                        if (!isNumber(scope.max)) {
                            throwError("max must be a number");
                        }

                        range = scope.max - scope.min;
                        allowedRange = [scope.min, scope.max];

                        // update models too
                        setModelMinMax();

                    }
                }

                function setModelMinMax () {

                    if (scope.modelMin > scope.modelMax) {
                        throwWarning("modelMin must be less than or equal to modelMax");
                        // reset values to correct
                        scope.modelMin = scope.modelMax;
                    }

                    // only do stuff when both values are ready
                    if (angular.isDefined(scope.modelMin) && angular.isDefined(scope.modelMax)) {

                        // make sure they are numbers
                        if (!isNumber(scope.modelMin)) {
                            throwWarning("modelMin must be a number");
                            scope.modelMin = scope.min;
                        }
                        if (!isNumber(scope.modelMax)) {
                            throwWarning("modelMax must be a number");
                            scope.modelMax = scope.max;
                        }

                        var handle1pos = restrict(((scope.modelMin - scope.min) / range) * 100),
                            handle2pos = restrict(((scope.modelMax - scope.min) / range) * 100);

                        // make sure the model values are within the allowed range
                        scope.modelMin = Math.max(scope.min, scope.modelMin);
                        scope.modelMax = Math.min(scope.max, scope.modelMax);

                        if (scope.filter) {
                            scope.filteredModelMin = $filter(scope.filter)(scope.modelMin, scope.filterOptions);
                            scope.filteredModelMax = $filter(scope.filter)(scope.modelMax, scope.filterOptions);
                        } else {
                            scope.filteredModelMin = scope.modelMin;
                            scope.filteredModelMax = scope.modelMax;
                        }

                        // check for no range
                        if (scope.min === scope.max && scope.modelMin == scope.modelMax) {

                            // reposition handles
                            angular.element(handles[0]).css(pos, '0%');

                            angular.element(handles[1]).css(pos, '100%');

                            // reposition join
                            angular.element(join).css(pos, '0%').css(posOpp, '0%');

                        } else {

                            // reposition handles
                            angular.element(handles[0]).css(pos, handle1pos + '%');

                            angular.element(handles[1]).css(pos, handle2pos + '%');

                            // reposition join
                            angular.element(join).css(pos, handle1pos + '%').css(posOpp, (100 - handle2pos) + '%');

                        }
                    }

                }

                function handleMove(index) {

                    var $handle = handles[index];

                    // on mousedown / touchstart
                    $handle.bind(onEvent, function (event) {

                        var handleDownClass = (index === 0 ? 'handle-min' : 'handle-max') + '-down',
                            unbind = $handle.add($document).add('body'),
                            modelValue = (index === 0 ? scope.modelMin : scope.modelMax) - scope.min,
                            originalPosition = (modelValue / range) * 100,
                            originalClick = client(event),
                            previousClick = originalClick,
                            previousProposal = false;

                        // stop user accidentally selecting stuff
                        angular.element('body').bind('selectstart' + eventNamespace, function () {
                            return false;
                        });

                        // only do stuff if we are disabled
                        if (!scope.disabled) {

                            // add down class
                            $handle.addClass('down');

                            $slider.addClass('focus ' + handleDownClass);

                            // add touch class for MS styling
                            angular.element('body').addClass('TOUCH');

                            // listen for mousemove / touchmove document events
                            $document.bind(moveEvent, function (e) {
                                // prevent default
                                e.preventDefault();

                                var currentClick = client(e),
                                    movement,
                                    proposal,
                                    other,
                                    per,
                                    otherModelPosition = (((index === 0 ? scope.modelMax : scope.modelMin) - scope.min) / range) * 100;

                                if (currentClick[0] === "x") {
                                    return;
                                }

                                // calculate deltas
                                currentClick[0] -= originalClick[0];
                                currentClick[1] -= originalClick[1];

                                // has movement occurred on either axis?
                                movement = [
                                    (previousClick[0] !== currentClick[0]), (previousClick[1] !== currentClick[1])
                                ];

                                // propose a movement
                                proposal = originalPosition + ((currentClick[orientation] * 100) / (orientation ? $slider.height() : $slider.width()));


                                // normalize so it can't move out of bounds
                                proposal = restrict(proposal);


                                // check which handle is being moved and add / remove margin
                                if (index === 0) {
                                    proposal = proposal > otherModelPosition ? otherModelPosition : proposal;
                                } else if (index === 1) {
                                    proposal = proposal < otherModelPosition ? otherModelPosition : proposal;
                                }

                                if (scope.step > 0) {
                                    // only change if we are within the extremes, otherwise we get strange rounding
                                    if (proposal < 100 && proposal > 0) {
                                        per = (scope.step / range) * 100;
                                        proposal = Math.round(proposal / per) * per;
                                    }
                                }

                                if (proposal > 95 && index === 0) {
                                    $handle.css('z-index', '3');
                                } else {
                                    $handle.css('z-index', '');
                                }

                                if (movement[orientation] && proposal != previousProposal) {

                                    if (index === 0) {

                                        // update model as we slide
                                        scope.modelMin = parseFloat((((proposal * range) / 100) + scope.min)).toFixed(scope.decimalPlaces);

                                    } else if (index === 1) {

                                        scope.modelMax = parseFloat((((proposal * range) / 100) + scope.min)).toFixed(scope.decimalPlaces);
                                    }

                                    // update angular
                                    scope.$apply();

                                    previousProposal = proposal;

                                }

                                previousClick = currentClick;

                            }).bind(offEvent, function () {

                                unbind.off(eventNamespace);

                                angular.element('body').removeClass('TOUCH');

                                // remove down class
                                $handle.removeClass('down');

                                // remove active class
                                $slider.removeClass('focus ' + handleDownClass);

                            });
                        }



                    });
                }

                function throwError (message) {
                    scope.disabled = true;
                    throw new Error("RangeSlider: " + message);
                }

                function throwWarning (message) {
                    $log.warn(message);
                }

                /**
                 * INIT
                 */

                $slider
                    // disable selection
                    .bind('selectstart' + eventNamespace, function (event) {
                        return false;
                    })
                    // stop propagation
                    .bind('click', function (event) {
                        event.stopPropagation();
                    });

                // bind events to each handle
                handleMove(0);
                handleMove(1);

            }
        };
    });
}());
