(function() {
    'use strict';

    angular
        .module('ui.rCalendar')
        .controller('ui.rCalendar.CalendarController', CalendarController);

    CalendarController.$inject = ['$scope', '$attrs', '$parse', '$interpolate', '$log', 'dateFilter', 'calendarConfig'];

    /* @ngInject */
    function CalendarController($scope, $attrs, $parse, $interpolate, $log, dateFilter, calendarConfig) {
        
        var vm = this,
            ngModelCtrl = {$setViewValue: angular.noop}; // nullModelCtrl;

        vm.init = init;
        vm.render = render;
        vm.refreshView = refreshView;
        vm.split = splitArray;
        vm.onEventSourceChanged = onEventSourceChanged;
        vm.move = move.bind($scope);
        vm.rangeChanged = rangeChanged;
        vm.placeEvents = placeEvents;
        vm.placeAllDayEvents = placeAllDayEvents;
        $scope.move = move;
        
        var options = ['formatDay', 'formatDayHeader', 'formatDayTitle', 'formatWeekTitle', 'formatMonthTitle', 'formatWeekViewDayHeader', 'formatHourColumn',
            'showWeeks', 'showEventDetail', 'startingDay', 'eventSource', 'queryMode'];

        angular.forEach(options, loadConfigurationOption);

        $scope.$parent.$watch($attrs.eventSource, function (value) {
            vm.onEventSourceChanged(value);
        });

        $scope.calendarMode = $scope.calendarMode || calendarConfig.calendarMode;
        if (angular.isDefined($attrs.initDate)) {
            vm.currentCalendarDate = $scope.$parent.$eval($attrs.initDate);
        }
        if (!vm.currentCalendarDate) {
            vm.currentCalendarDate = new Date();
            if ($attrs.ngModel && !$scope.$parent.$eval($attrs.ngModel)) {
                $parse($attrs.ngModel).assign($scope.$parent, vm.currentCalendarDate);
            }
        }


        function loadConfigurationOption(key, index) {
            vm[key] = angular.isDefined($attrs[key]) ? (index < 7 ? $interpolate($attrs[key])($scope.$parent) : $scope.$parent.$eval($attrs[key])) : calendarConfig[key];
        }

        function init(ngModelCtrl_) {
            ngModelCtrl = ngModelCtrl_;

            ngModelCtrl.$render = function () {
                vm.render();
            };
        }

        function render() {
            if (ngModelCtrl.$modelValue) {
                var date = new Date(ngModelCtrl.$modelValue),
                    isValid = !isNaN(date);

                if (isValid) {
                    vm.currentCalendarDate = date;
                } else {
                    $log.error('"ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
                }
                ngModelCtrl.$setValidity('date', isValid);
            }
            vm.refreshView();
        }

        function refreshView() {
            if (vm.mode) {
                vm.range = vm._getRange(vm.currentCalendarDate);
                vm._refreshView();
                vm.rangeChanged();
            }
        }

        // Split array into smaller arrays
        function splitArray(arr, size) {
            var arrays = [];
            while (arr.length > 0) {
                arrays.push(arr.splice(0, size));
            }
            return arrays;
        }

        function onEventSourceChanged(value) {
            vm.eventSource = value;
            if (vm._onDataLoaded) {
                vm._onDataLoaded();
            }
        }

        function move(direction) {
            var step = vm.mode.step,
                currentCalendarDate = vm.currentCalendarDate,
                year = currentCalendarDate.getFullYear() + direction * (step.years || 0),
                month = currentCalendarDate.getMonth() + direction * (step.months || 0),
                date = currentCalendarDate.getDate() + direction * (step.days || 0),
                firstDayInNextMonth;

            currentCalendarDate.setFullYear(year, month, date);
            if ($scope.calendarMode === 'month') {
                firstDayInNextMonth = new Date(year, month + 1, 1);
                if (firstDayInNextMonth.getTime() <= currentCalendarDate.getTime()) {
                    vm.currentCalendarDate = new Date(firstDayInNextMonth - 24 * 60 * 60 * 1000);
                }
            }
            ngModelCtrl.$setViewValue(vm.currentCalendarDate);
            vm.refreshView();
        }

        function rangeChanged() {
            if (vm.queryMode === 'local') {
                if (vm.eventSource && vm._onDataLoaded) {
                    vm._onDataLoaded();
                }
            } else if (vm.queryMode === 'remote') {
                if ($scope.rangeChanged) {
                    $scope.rangeChanged({
                        startTime: vm.range.startTime,
                        endTime: vm.range.endTime
                    });
                }
            }
        }

        function overlap(event1, event2) {
            return !(event1.endIndex <= event2.startIndex || event2.endIndex <= event1.startIndex);
        }

        function calculatePosition(events) {
            var i,
                j,
                len = events.length,
                maxColumn = 0,
                col,
                isForbidden = new Array(len);

            for (i = 0; i < len; i += 1) {
                for (col = 0; col < maxColumn; col += 1) {
                    isForbidden[col] = false;
                }
                for (j = 0; j < i; j += 1) {
                    if (overlap(events[i], events[j])) {
                        isForbidden[events[j].position] = true;
                    }
                }
                for (col = 0; col < maxColumn; col += 1) {
                    if (!isForbidden[col]) {
                        break;
                    }
                }
                if (col < maxColumn) {
                    events[i].position = col;
                } else {
                    events[i].position = maxColumn++;
                }
            }
        }

        function calculateWidth(orderedEvents) {
            var cells = new Array(24),
                event,
                index,
                i,
                j,
                len,
                eventCountInCell,
                currentEventInCell;

            //sort by position in descending order, the right most columns should be calculated first
            orderedEvents.sort(function (eventA, eventB) {
                return eventB.position - eventA.position;
            });
            for (i = 0; i < 24; i += 1) {
                cells[i] = {
                    calculated: false,
                    events: []
                };
            }
            len = orderedEvents.length;
            for (i = 0; i < len; i += 1) {
                event = orderedEvents[i];
                index = event.startIndex;
                while (index < event.endIndex) {
                    cells[index].events.push(event);
                    index += 1;
                }
            }

            i = 0;
            while (i < len) {
                event = orderedEvents[i];
                if (!event.overlapNumber) {
                    var overlapNumber = event.position + 1;
                    event.overlapNumber = overlapNumber;
                    var eventQueue = [event];
                    while ((event = eventQueue.shift())) {
                        index = event.startIndex;
                        while (index < event.endIndex) {
                            if (!cells[index].calculated) {
                                cells[index].calculated = true;
                                if (cells[index].events) {
                                    eventCountInCell = cells[index].events.length;
                                    for (j = 0; j < eventCountInCell; j += 1) {
                                        currentEventInCell = cells[index].events[j];
                                        if (!currentEventInCell.overlapNumber) {
                                            currentEventInCell.overlapNumber = overlapNumber;
                                            eventQueue.push(currentEventInCell);
                                        }
                                    }
                                }
                            }
                            index += 1;
                        }
                    }
                }
                i += 1;
            }
        }

        function placeEvents(orderedEvents) {
            calculatePosition(orderedEvents);
            calculateWidth(orderedEvents);
        }

        function placeAllDayEvents(orderedEvents) {
            calculatePosition(orderedEvents);
        }
    }
})();