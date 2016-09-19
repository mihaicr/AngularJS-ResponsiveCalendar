angular.module("template/rcalendar/calendar.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/rcalendar/calendar.html",
    "<div ng-switch=\"calendarMode\">\n" +
    "    <div class=\"row calendar-navbar\">\n" +
    "        <div class=\"nav-left col-xs-2\">\n" +
    "            <button type=\"button\" class=\"btn btn-default btn-sm\" ng-click=\"move(-1)\"><i\n" +
    "                    class=\"glyphicon glyphicon-chevron-left\"></i></button>\n" +
    "        </div>\n" +
    "        <div class=\"calendar-header col-xs-8\">{{title}}</div>\n" +
    "        <div class=\"nav-right col-xs-2\">\n" +
    "            <button type=\"button\" class=\"btn btn-default btn-sm\" ng-click=\"move(1)\"><i\n" +
    "                    class=\"glyphicon glyphicon-chevron-right\"></i></button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <dayview ng-switch-when=\"day\"></dayview>\n" +
    "    <monthview ng-switch-when=\"month\"></monthview>\n" +
    "    <weekview ng-switch-when=\"week\"></weekview>\n" +
    "</div>\n" +
    "");
}]);

angular.module("template/rcalendar/day.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/rcalendar/day.html",
    "<div>\n" +
    "    <div ng-if=\"CalendarController.showAllDayEventHeader\" class=\"dayview-allday-table\">\n" +
    "        <div class=\"dayview-allday-label\">\n" +
    "            all day\n" +
    "        </div>\n" +
    "        <div class=\"dayview-allday-content-wrapper\">\n" +
    "            <table class=\"table table-bordered dayview-allday-content-table\">\n" +
    "                <tbody>\n" +
    "                <tr>\n" +
    "                    <td class=\"calendar-cell\" ng-class=\"{'calendar-event-wrap':allDayEvents}\"\n" +
    "                        ng-style=\"{height: 25*allDayEvents.length+'px'}\">\n" +
    "                        <div ng-repeat=\"displayEvent in allDayEvents\" class=\"calendar-event\"\n" +
    "                             ng-click=\"eventSelected({event:displayEvent.event})\"\n" +
    "                             ng-style=\"{top: 25*$index+'px',width: '100%',height:'25px'}\">\n" +
    "                            <div class=\"calendar-event-inner\">{{displayEvent.event.title}}</div>\n" +
    "                        </div>\n" +
    "                    </td>\n" +
    "                    <td ng-if=\"allDayEventGutterWidth>0\" class=\"gutter-column\"\n" +
    "                        ng-style=\"{width:allDayEventGutterWidth+'px'}\"></td>\n" +
    "                </tr>\n" +
    "                </tbody>\n" +
    "            </table>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"scrollable\" style=\"height: 400px\">\n" +
    "        <table class=\"table table-bordered table-fixed\">\n" +
    "            <tbody>\n" +
    "            <tr ng-repeat=\"tm in rows track by $index\">\n" +
    "                <td class=\"calendar-hour-column text-center\">\n" +
    "                    {{CalendarController.formatDayHour(tm.time)}}\n" +
    "                </td>\n" +
    "                <td class=\"calendar-cell\" ng-click=\"select(tm.time)\">\n" +
    "                    <div ng-class=\"{'calendar-event-wrap': tm.events}\" ng-if=\"tm.events\">\n" +
    "                        <div ng-repeat=\"displayEvent in tm.events\" class=\"calendar-event\"\n" +
    "                             ng-click=\"eventSelected({event:displayEvent.event})\"\n" +
    "                             ng-style=\"{left: 100/displayEvent.overlapNumber*displayEvent.position+'%', width: 100/displayEvent.overlapNumber+'%', height: 37*(displayEvent.endIndex-displayEvent.startIndex)+'px'}\">\n" +
    "                            <div class=\"calendar-event-inner\">{{displayEvent.event.title}}</div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </td>\n" +
    "            </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("template/rcalendar/month.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/rcalendar/month.html",
    "<div>\n" +
    "    <table class=\"table table-bordered table-fixed monthview-datetable monthview-datetable\">\n" +
    "        <thead>\n" +
    "        <tr>\n" +
    "            <th ng-show=\"showWeeks\" class=\"calendar-week-column text-center\">#</th>\n" +
    "            <th ng-repeat=\"label in labels track by $index\" class=\"text-center\">\n" +
    "                <small>{{label}}</small>\n" +
    "            </th>\n" +
    "        </tr>\n" +
    "        </thead>\n" +
    "        <tbody>\n" +
    "        <tr ng-repeat=\"row in rows track by $index\">\n" +
    "            <td ng-show=\"showWeeks\" class=\"calendar-week-column text-center\">\n" +
    "                <small><em>{{ weekNumbers[$index] }}</em></small>\n" +
    "            </td>\n" +
    "            <td ng-repeat=\"dt in row track by dt.date\" class=\"monthview-dateCell\" ng-click=\"select(dt.date)\"\n" +
    "                ng-class=\"{'text-center':true, 'monthview-current': dt.current&&!dt.selected&&!dt.hasEvent,'monthview-secondary-with-event': dt.secondary&&dt.hasEvent, 'monthview-primary-with-event':!dt.secondary&&dt.hasEvent&&!dt.selected, 'monthview-selected': dt.selected}\">\n" +
    "                <div ng-class=\"{'text-muted':dt.secondary}\">\n" +
    "                    {{dt.label}}\n" +
    "                </div>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "        </tbody>\n" +
    "    </table>\n" +
    "    <div ng-if=\"showEventDetail\" class=\"event-detail-container\">\n" +
    "        <div class=\"scrollable\" style=\"height: 200px\">\n" +
    "            <table class=\"table table-bordered table-striped table-fixed\">\n" +
    "                <tr ng-repeat=\"event in selectedDate.events\" ng-if=\"selectedDate.events\">\n" +
    "                    <td ng-if=\"!event.allDay\" class=\"monthview-eventdetail-timecolumn\">{{event.startTime|date: 'HH:mm'}}\n" +
    "                        -\n" +
    "                        {{event.endTime|date: 'HH:mm'}}\n" +
    "                    </td>\n" +
    "                    <td ng-if=\"event.allDay\" class=\"monthview-eventdetail-timecolumn\">All day</td>\n" +
    "                    <td class=\"event-detail\" ng-click=\"eventSelected({event:event})\">{{event.title}}</td>\n" +
    "                </tr>\n" +
    "                <tr ng-if=\"!selectedDate.events\"><td class=\"no-event-label\">No Events</td></tr>\n" +
    "            </table>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("template/rcalendar/week.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("template/rcalendar/week.html",
    "<div>\n" +
    "    <table class=\"table table-bordered table-fixed weekview-header\">\n" +
    "        <thead>\n" +
    "        <tr>\n" +
    "            <th class=\"calendar-hour-column\"></th>\n" +
    "            <th ng-repeat=\"dt in dates\" class=\"text-center weekview-header-label\">{{dt.date| date:\n" +
    "                formatWeekViewDayHeader}}\n" +
    "            </th>\n" +
    "            <th ng-if=\"gutterWidth>0\" class=\"gutter-column\" ng-style=\"{width: gutterWidth+'px'}\"></th>\n" +
    "        </tr>\n" +
    "        </thead>\n" +
    "    </table>\n" +
    "    <div class=\"weekview-allday-table\">\n" +
    "        <div class=\"weekview-allday-label\">\n" +
    "            all day\n" +
    "        </div>\n" +
    "        <div class=\"weekview-allday-content-wrapper\">\n" +
    "            <table class=\"table table-bordered table-fixed weekview-allday-content-table\">\n" +
    "                <tbody>\n" +
    "                <tr>\n" +
    "                    <td ng-repeat=\"day in dates track by day.date\" class=\"calendar-cell\">\n" +
    "                        <div ng-class=\"{'calendar-event-wrap': day.events}\" ng-if=\"day.events\"\n" +
    "                             ng-style=\"{height: 25*day.events.length+'px'}\">\n" +
    "                            <div ng-repeat=\"displayEvent in day.events\" class=\"calendar-event\"\n" +
    "                                 ng-click=\"eventSelected({event:displayEvent.event})\"\n" +
    "                                 ng-style=\"{top: 25*displayEvent.position+'px', width: 100*(displayEvent.endIndex-displayEvent.startIndex)+'%', height: '25px'}\">\n" +
    "                                <div class=\"calendar-event-inner\">{{displayEvent.event.title}}</div>\n" +
    "                            </div>\n" +
    "                        </div>\n" +
    "                    </td>\n" +
    "                    <td ng-if=\"allDayEventGutterWidth>0\" class=\"gutter-column\"\n" +
    "                        ng-style=\"{width: allDayEventGutterWidth+'px'}\"></td>\n" +
    "                </tr>\n" +
    "                </tbody>\n" +
    "            </table>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "    <div class=\"scrollable\" style=\"height: 400px\">\n" +
    "        <table class=\"table table-bordered table-fixed\">\n" +
    "            <tbody>\n" +
    "            <tr ng-repeat=\"row in rows track by $index\">\n" +
    "                <td class=\"calendar-hour-column text-center\">\n" +
    "                    {{row[0].time | date: formatHourColumn}}\n" +
    "                </td>\n" +
    "                <td ng-repeat=\"tm in row track by tm.time\" class=\"calendar-cell\" ng-click=\"select(tm.time)\">\n" +
    "                    <div ng-class=\"{'calendar-event-wrap': tm.events}\" ng-if=\"tm.events\">\n" +
    "                        <div ng-repeat=\"displayEvent in tm.events\" class=\"calendar-event\"\n" +
    "                             ng-click=\"eventSelected({event:displayEvent.event})\"\n" +
    "                             ng-style=\"{left: 100/displayEvent.overlapNumber*displayEvent.position+'%', width: 100/displayEvent.overlapNumber+'%', height: 37*(displayEvent.endIndex-displayEvent.startIndex)+'px'}\">\n" +
    "                            <div class=\"calendar-event-inner\">{{displayEvent.event.title}}</div>\n" +
    "                        </div>\n" +
    "                    </div>\n" +
    "                </td>\n" +
    "                <td ng-if=\"normalGutterWidth>0\" class=\"gutter-column\" ng-style=\"{width: normalGutterWidth+'px'}\"></td>\n" +
    "            </tr>\n" +
    "            </tbody>\n" +
    "        </table>\n" +
    "    </div>\n" +
    "</div>");
}]);

angular.module("ui.rCalendar.tpls", ["template/rcalendar/calendar.html","template/rcalendar/day.html","template/rcalendar/month.html","template/rcalendar/week.html"]);

(function () {
    'use strict';

    angular
        .module('ui.rCalendar', ['ui.rCalendar.tpls'])
        .constant('calendarConfig', {
            formatDay: 'dd',
            formatDayHeader: 'EEE',
            formatDayTitle: 'MMMM dd, yyyy',
            formatWeekTitle: 'MMMM yyyy, Week w',
            formatMonthTitle: 'MMMM yyyy',
            formatWeekViewDayHeader: 'EEE d',
            formatHourColumn: 'ha',
            calendarMode: 'month',
            showWeeks: false,
            showEventDetail: true,
            startingDay: 0,
            eventSource: null,
            queryMode: 'local',
            dayViewHourIntervals: 1,
            showAllDayEventHeader: true,
            allDayIntervalLabelFormatter: undefined
        });
})();

(function() {
    'use strict';

    angular
        .module('ui.rCalendar')
        .controller('ui.rCalendar.CalendarController', CalendarController);

    CalendarController.$inject = ['$scope', '$attrs', '$parse', '$interpolate', '$log', '$filter', 'calendarConfig'];

    /* @ngInject */
    function CalendarController($scope, $attrs, $parse, $interpolate, $log, $filter, calendarConfig) {
        
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
        vm.formatDayHour = formatDayHour;
        $scope.move = move;
        
        var options = ['formatDay', 'formatDayHeader', 'formatDayTitle', 'formatWeekTitle', 'formatMonthTitle', 'formatWeekViewDayHeader', 'formatHourColumn',
            'showWeeks', 'showEventDetail', 'startingDay', 'eventSource', 'queryMode', 'dayViewHourIntervals', 'showAllDayEventHeader', 'allDayIntervalLabelFormatter'];

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

        function formatDayHour(time) {
            var result;
            if (angular.isFunction(vm.allDayIntervalLabelFormatter)) {
                result = vm.allDayIntervalLabelFormatter(time);
            } else {
                result = $filter('date')(time, vm.formatHourColumn);
            }

            return result;
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('ui.rCalendar')
        .directive('calendar', ResponsiveCalendar);

    /* @ngInject */
    function ResponsiveCalendar() {
        var responsiveCalendar = {
            restrict: 'EA',
            replace: true,
            templateUrl: 'template/rcalendar/calendar.html',
            scope: {
                calendarMode: '=',
                rangeChanged: '&',
                eventSelected: '&',
                timeSelected: '&'
            },
            require: ['calendar', '?^ngModel'],
            controller: 'ui.rCalendar.CalendarController',
            controllerAs: 'CalendarController',
            link: link
        };
        return responsiveCalendar;

        function link(scope, element, attrs, ctrls) {
            var calendarCtrl = ctrls[0],
                ngModelCtrl = ctrls[1];

            if (ngModelCtrl) {
                calendarCtrl.init(ngModelCtrl);
            }

            scope.$on('changeDate', onChangeDate);
            scope.$on('eventSourceChanged', onEventSourceChanged);
            
            function onChangeDate(event, direction) {
                calendarCtrl.move(direction);
            }
            
            function onEventSourceChanged(event, value) {
                calendarCtrl.onEventSourceChanged(value);
            }
        }
    }
})();


(function () {
    'use strict';

    angular
        .module('ui.rCalendar')
        .directive('dayview', DayView);

    DayView.$inject = ['dateFilter', '$timeout'];

    /* @ngInject */
    function  DayView(dateFilter, $timeout) {
        var dayView = {
            restrict: 'EA',
            replace: true,
            templateUrl: 'template/rcalendar/day.html',
            require: '^calendar',
            link: link
        };
        
        var hourIntervalsPeriod;
        
        return dayView;

        function link(scope, element, attrs, ctrl) {
            scope.formatHourColumn = ctrl.formatHourColumn;
            scope.select = select;

            ctrl._onDataLoaded = _onDataLoaded;
            ctrl._refreshView = _refreshView;
            ctrl._getRange = _getRange;
            ctrl.mode = {
                step: {days: 1}
            };

            $timeout(updateScrollGutter);
            ctrl.refreshView();


            function updateScrollGutter() {
                var children = element.children();
                var allDayEventGutterWidth, normalEventBody;
                if (ctrl.showAllDayEventHeader) {
                    var allDayEventBody = children[0].children[1];
                    allDayEventGutterWidth = allDayEventBody.offsetWidth - allDayEventBody.clientWidth;
                    normalEventBody = children[1];
                } else {
                    normalEventBody = children[0];
                }
                var normalEventGutterWidth = normalEventBody.offsetWidth - normalEventBody.clientWidth;
                var gutterWidth = allDayEventGutterWidth || normalEventGutterWidth || 0;
                if (gutterWidth > 0) {
                    scope.allDayEventGutterWidth = allDayEventGutterWidth < 0 ? gutterWidth : 0;
                    scope.normalGutterWidth = normalEventGutterWidth < 0 ? gutterWidth: 0;
                }
            }

            function createDateObjects(startTime) {
                var rows = [],
                    time,
                    currentHour = startTime.getHours(),
                    currentDate = startTime.getDate(),
                    hourIntervalsPeriod = getHourIntervalsPeriod();

                for (var hour = 0; hour < 24; hour++) {
                    time = new Date(startTime.getTime());
                    time.setHours(currentHour + hour);
                    time.setDate(currentDate);
                    addDates(hourIntervalsPeriod, rows, time);
                }
                
                return rows;
            }
            
            function addDates(hourIntervalsPeriod, rows, time) {
                if (hourIntervalsPeriod === 1) {
                    rows.push({
                        time: time
                    });
                } else {
                    var minutes = 0,
                        originalTime = time.getTime(),
                        intervalTime;
                    while (minutes < 60) {
                        intervalTime = new Date(originalTime);
                        intervalTime.setMinutes(minutes);
                        rows.push({
                            time: intervalTime
                        });
                        minutes += hourIntervalsPeriod;
                    }
                }
            }

            function getHourIntervalsPeriod() {
                if (!hourIntervalsPeriod) {
                    if (Number.isInteger(ctrl.dayViewHourIntervals) && ctrl.dayViewHourIntervals > 1 && ctrl.dayViewHourIntervals <= 10) {
                        hourIntervalsPeriod = Math.floor(60 / ctrl.dayViewHourIntervals);
                    } else {
                        hourIntervalsPeriod = 1;
                    }
                }

                return hourIntervalsPeriod;
            }

            function select(selectedTime) {
                if (scope.timeSelected) {
                    scope.timeSelected({selectedTime: selectedTime});
                }
            }

            function _onDataLoaded() {
                var eventSource = ctrl.eventSource,
                    len = eventSource ? eventSource.length : 0,
                    startTime = ctrl.range.startTime,
                    endTime = ctrl.range.endTime,
                    timeZoneOffset = -new Date().getTimezoneOffset(),
                    utcStartTime = new Date(startTime.getTime() + timeZoneOffset * 60 * 1000),
                    utcEndTime = new Date(endTime.getTime() + timeZoneOffset * 60 * 1000),
                    rows = scope.rows,
                    allDayEvents = [],
                    oneHour = 3600000,
                    eps = 0.016,
                    eventSet,
                    normalEventInRange = false,
                    hour;

                if (rows.hasEvent) {
                    for (hour = 0; hour < 24; hour += 1) {
                        if (rows[hour].events) {
                            rows[hour].events = null;
                        }
                    }
                    rows.hasEvent = false;
                }

                for (var i = 0; i < len; i += 1) {
                    var event = eventSource[i];
                    var eventStartTime = new Date(event.startTime);
                    var eventEndTime = new Date(event.endTime);

                    if (event.allDay) {
                        if (eventEndTime <= utcStartTime || eventStartTime >= utcEndTime) {
                            continue;
                        } else {
                            allDayEvents.push({
                                event: event
                            });
                        }
                    } else {
                        if (eventEndTime <= startTime || eventStartTime >= endTime) {
                            continue;
                        } else {
                            normalEventInRange = true;
                        }

                        var timeDifferenceStart;
                        if (eventStartTime <= startTime) {
                            timeDifferenceStart = 0;
                        } else {
                            timeDifferenceStart = (eventStartTime - startTime) / oneHour;
                        }

                        var timeDifferenceEnd;
                        if (eventEndTime >= endTime) {
                            timeDifferenceEnd = (endTime - startTime) / oneHour;
                        } else {
                            timeDifferenceEnd = (eventEndTime - startTime) / oneHour;
                        }

                        var startIndex = Math.floor(timeDifferenceStart);
                        var endIndex = Math.ceil(timeDifferenceEnd - eps);

                        var displayEvent = {
                            event: event,
                            startIndex: startIndex,
                            endIndex: endIndex
                        };

                        eventSet = rows[startIndex].events;
                        if (eventSet) {
                            eventSet.push(displayEvent);
                        } else {
                            eventSet = [];
                            eventSet.push(displayEvent);
                            rows[startIndex].events = eventSet;
                        }
                    }
                }

                if (normalEventInRange) {
                    var orderedEvents = [];
                    for (hour = 0; hour < 24; hour += 1) {
                        if (rows[hour].events) {
                            orderedEvents = orderedEvents.concat(rows[hour].events);
                        }
                    }
                    if (orderedEvents.length > 0) {
                        rows.hasEvent = true;
                        ctrl.placeEvents(orderedEvents);
                    }
                }

                scope.allDayEvents = allDayEvents;

                $timeout(function () {
                    updateScrollGutter();
                });
            }

            function _refreshView() {
                var startingDate = ctrl.range.startTime;

                scope.rows = createDateObjects(startingDate);
                scope.allDayEvents = [];
                scope.dates = [startingDate];
                scope.$parent.title = dateFilter(startingDate, ctrl.formatDayTitle);
            }

            function _getRange(currentDate) {
                var year = currentDate.getFullYear(),
                    month = currentDate.getMonth(),
                    date = currentDate.getDate(),
                    startTime = new Date(year, month, date),
                    endTime = new Date(year, month, date + 1);

                return {
                    startTime: startTime,
                    endTime: endTime
                };
            }
        }
    }
})();
(function () {
    'use strict';

    angular
        .module('ui.rCalendar')
        .directive('monthview', MonthView);

    MonthView.$inject = ['dateFilter'];

    /* @ngInject */
    function  MonthView(dateFilter) {
        var monthView = {
            restrict: 'EA',
            replace: true,
            templateUrl: 'template/rcalendar/month.html',
            require: ['^calendar', '?^ngModel'],
            link: link
        };
        return monthView;

        function link(scope, element, attrs, ctrls) {
            var ctrl = ctrls[0],
                ngModelCtrl = ctrls[1];
            scope.showWeeks = ctrl.showWeeks;
            scope.showEventDetail = ctrl.showEventDetail;
            scope.select = select;

            ctrl._refreshView = _refreshView;
            ctrl._onDataLoaded = _onDataLoaded;
            ctrl.compare = compare;
            ctrl._getRange = _getRange;
            ctrl.mode = {
                step: {months: 1}
            };
            ctrl.refreshView();

            function getDates(startDate, n) {
                var dates = new Array(n), current = new Date(startDate), i = 0;
                current.setHours(12); // Prevent repeated dates because of timezone bug
                while (i < n) {
                    dates[i++] = new Date(current);
                    current.setDate(current.getDate() + 1);
                }
                return dates;
            }

            function select(selectedDate) {
                var rows = scope.rows;
                if (rows) {
                    var currentCalendarDate = ctrl.currentCalendarDate;
                    var currentMonth = currentCalendarDate.getMonth();
                    var currentYear = currentCalendarDate.getFullYear();
                    var selectedMonth = selectedDate.getMonth();
                    var selectedYear = selectedDate.getFullYear();
                    var direction = 0;
                    if (currentYear === selectedYear) {
                        if (currentMonth !== selectedMonth) {
                            direction = currentMonth < selectedMonth ? 1 : -1;
                        }
                    } else {
                        direction = currentYear < selectedYear ? 1 : -1;
                    }

                    ctrl.currentCalendarDate = selectedDate;
                    if (ngModelCtrl) {
                        ngModelCtrl.$setViewValue(selectedDate);
                    }
                    if (direction === 0) {
                        for (var row = 0; row < 6; row += 1) {
                            for (var date = 0; date < 7; date += 1) {
                                var selected = ctrl.compare(selectedDate, rows[row][date].date) === 0;
                                rows[row][date].selected = selected;
                                if (selected) {
                                    scope.selectedDate = rows[row][date];
                                }
                            }
                        }
                    } else {
                        ctrl.refreshView();
                    }

                    if (scope.timeSelected) {
                        scope.timeSelected({selectedTime: selectedDate});
                    }
                }
            }

            function _refreshView() {
                var startDate = ctrl.range.startTime,
                    date = startDate.getDate(),
                    month = (startDate.getMonth() + (date !== 1 ? 1 : 0)) % 12,
                    year = startDate.getFullYear() + (date !== 1 && month === 0 ? 1 : 0);

                var days = getDates(startDate, 42);
                for (var i = 0; i < 42; i++) {
                    days[i] = angular.extend(createDateObject(days[i], ctrl.formatDay), {
                        secondary: days[i].getMonth() !== month
                    });
                }

                scope.labels = new Array(7);
                for (var j = 0; j < 7; j++) {
                    scope.labels[j] = dateFilter(days[j].date, ctrl.formatDayHeader);
                }

                var headerDate = new Date(year, month, 1);
                scope.$parent.title = dateFilter(headerDate, ctrl.formatMonthTitle);
                scope.rows = ctrl.split(days, 7);

                if (scope.showWeeks) {
                    scope.weekNumbers = [];
                    var thursdayIndex = (4 + 7 - ctrl.startingDay) % 7,
                        numWeeks = scope.rows.length;
                    for (var curWeek = 0; curWeek < numWeeks; curWeek++) {
                        scope.weekNumbers.push(
                            getISO8601WeekNumber(scope.rows[curWeek][thursdayIndex].date));
                    }
                }
            }

            function createDateObject(date, format) {
                return {
                    date: date,
                    label: dateFilter(date, format),
                    selected: ctrl.compare(date, ctrl.currentCalendarDate) === 0,
                    current: ctrl.compare(date, new Date()) === 0
                };
            }

            function compareEvent(event1, event2) {
                if (event1.allDay) {
                    return 1;
                } else if (event2.allDay) {
                    return -1;
                } else {
                    return (event1.startTime.getTime() - event2.startTime.getTime());
                }
            }

            function _onDataLoaded() {
                var eventSource = ctrl.eventSource,
                    len = eventSource ? eventSource.length : 0,
                    startTime = ctrl.range.startTime,
                    endTime = ctrl.range.endTime,
                    timeZoneOffset = -new Date().getTimezoneOffset(),
                    utcStartTime = new Date(startTime.getTime() + timeZoneOffset * 60000),
                    utcEndTime = new Date(endTime.getTime() + timeZoneOffset * 60000),
                    rows = scope.rows,
                    oneDay = 86400000,
                    eps = 0.001,
                    row,
                    date,
                    hasEvent = false;

                if (rows.hasEvent) {
                    for (row = 0; row < 6; row += 1) {
                        for (date = 0; date < 7; date += 1) {
                            if (rows[row][date].hasEvent) {
                                rows[row][date].events = null;
                                rows[row][date].hasEvent = false;
                            }
                        }
                    }
                }

                for (var i = 0; i < len; i += 1) {
                    var event = eventSource[i];
                    var eventStartTime = new Date(event.startTime);
                    var eventEndTime = new Date(event.endTime);
                    var st;
                    var et;

                    if (event.allDay) {
                        if (eventEndTime <= utcStartTime || eventStartTime >= utcEndTime) {
                            continue;
                        } else {
                            st = utcStartTime;
                            et = utcEndTime;
                        }
                    } else {
                        if (eventEndTime <= startTime || eventStartTime >= endTime) {
                            continue;
                        } else {
                            st = startTime;
                            et = endTime;
                        }
                    }

                    var timeDifferenceStart;
                    if (eventStartTime <= st) {
                        timeDifferenceStart = 0;
                    } else {
                        timeDifferenceStart = (eventStartTime - st) / oneDay;
                    }

                    var timeDifferenceEnd;
                    if (eventEndTime >= et) {
                        timeDifferenceEnd = (et - st) / oneDay;
                    } else {
                        timeDifferenceEnd = (eventEndTime - st) / oneDay;
                    }

                    var index = Math.floor(timeDifferenceStart);
                    var eventSet;
                    while (index < timeDifferenceEnd - eps) {
                        var rowIndex = Math.floor(index / 7);
                        var dayIndex = Math.floor(index % 7);
                        rows[rowIndex][dayIndex].hasEvent = true;
                        eventSet = rows[rowIndex][dayIndex].events;
                        if (eventSet) {
                            eventSet.push(event);
                        } else {
                            eventSet = [];
                            eventSet.push(event);
                            rows[rowIndex][dayIndex].events = eventSet;
                        }
                        index += 1;
                    }
                }

                for (row = 0; row < 6; row += 1) {
                    for (date = 0; date < 7; date += 1) {
                        if (rows[row][date].hasEvent) {
                            hasEvent = true;
                            rows[row][date].events.sort(compareEvent);
                        }
                    }
                }
                rows.hasEvent = hasEvent;

                var findSelected = false;
                for (row = 0; row < 6; row += 1) {
                    for (date = 0; date < 7; date += 1) {
                        if (rows[row][date].selected) {
                            scope.selectedDate = rows[row][date];
                            findSelected = true;
                            break;
                        }
                    }
                    if (findSelected) {
                        break;
                    }
                }
            }

            function compare(date1, date2) {
                return (new Date(date1.getFullYear(), date1.getMonth(), date1.getDate()) - new Date(date2.getFullYear(), date2.getMonth(), date2.getDate()) );
            }

            function _getRange(currentDate) {
                var year = currentDate.getFullYear(),
                    month = currentDate.getMonth(),
                    firstDayOfMonth = new Date(year, month, 1),
                    difference = ctrl.startingDay - firstDayOfMonth.getDay(),
                    numDisplayedFromPreviousMonth = (difference > 0) ? 7 - difference : -difference,
                    startDate = new Date(firstDayOfMonth),
                    endDate;

                if (numDisplayedFromPreviousMonth > 0) {
                    startDate.setDate(-numDisplayedFromPreviousMonth + 1);
                }

                endDate = new Date(startDate);
                endDate.setDate(endDate.getDate() + 42);

                return {
                    startTime: startDate,
                    endTime: endDate
                };
            }

            function getISO8601WeekNumber(date) {
                var checkDate = new Date(date);
                checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7)); // Thursday
                var time = checkDate.getTime();
                checkDate.setMonth(0); // Compare with Jan 1
                checkDate.setDate(1);
                return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
            }
        }
    }
})();

(function () {
    'use strict';

    angular
        .module('ui.rCalendar')
        .directive('weekview', WeekView);

    WeekView.$inject = ['dateFilter', '$timeout'];

    /* @ngInject */
    function  WeekView(dateFilter, $timeout) {
        var weekView = {
            restrict: 'EA',
            replace: true,
            templateUrl: 'template/rcalendar/week.html',
            require: '^calendar',
            link: link
        };
        return weekView;

        function link(scope, element, attrs, ctrl) {
            scope.formatWeekViewDayHeader = ctrl.formatWeekViewDayHeader;
            scope.formatHourColumn = ctrl.formatHourColumn;
            scope.select = select;

            ctrl._onDataLoaded = _onDataLoaded;
            ctrl._refreshView = _refreshView;
            ctrl._getRange = _getRange;
            ctrl.mode = {
                step: {days: 7}
            };

            $timeout(updateScrollGutter);

            ctrl.refreshView();

            function updateScrollGutter() {
                var children = element.children();
                var allDayEventBody = children[1].children[1];
                var allDayEventGutterWidth = allDayEventBody.offsetWidth - allDayEventBody.clientWidth;
                var normalEventBody = children[2];
                var normalEventGutterWidth = normalEventBody.offsetWidth - normalEventBody.clientWidth;
                var gutterWidth = allDayEventGutterWidth || normalEventGutterWidth || 0;
                if (gutterWidth > 0) {
                    scope.gutterWidth = gutterWidth;
                    if (allDayEventGutterWidth <= 0) {
                        scope.allDayEventGutterWidth = gutterWidth;
                    } else {
                        scope.allDayEventGutterWidth = 0;
                    }
                    if (normalEventGutterWidth <= 0) {
                        scope.normalGutterWidth = gutterWidth;
                    } else {
                        scope.normalGutterWidth = 0;
                    }
                }
            }

            function getDates(startTime, n) {
                var dates = new Array(n),
                    current = new Date(startTime),
                    i = 0;
                current.setHours(12); // Prevent repeated dates because of timezone bug
                while (i < n) {
                    dates[i++] = {
                        date: new Date(current)
                    };
                    current.setDate(current.getDate() + 1);
                }
                return dates;
            }

            function createDateObjects(startTime) {
                var times = [],
                    row,
                    time,
                    currentHour = startTime.getHours(),
                    currentDate = startTime.getDate();

                for (var hour = 0; hour < 24; hour += 1) {
                    row = [];
                    for (var day = 0; day < 7; day += 1) {
                        time = new Date(startTime.getTime());
                        time.setHours(currentHour + hour);
                        time.setDate(currentDate + day);
                        row.push({
                            time: time
                        });
                    }
                    times.push(row);
                }
                return times;
            }

            function select(selectedTime) {
                if (scope.timeSelected) {
                    scope.timeSelected({selectedTime: selectedTime});
                }
            }

            function _onDataLoaded() {
                var eventSource = ctrl.eventSource,
                    len = eventSource ? eventSource.length : 0,
                    startTime = ctrl.range.startTime,
                    endTime = ctrl.range.endTime,
                    timeZoneOffset = -new Date().getTimezoneOffset(),
                    utcStartTime = new Date(startTime.getTime() + timeZoneOffset * 60 * 1000),
                    utcEndTime = new Date(endTime.getTime() + timeZoneOffset * 60 * 1000),
                    rows = scope.rows,
                    dates = scope.dates,
                    oneHour = 3600000,
                    oneDay = 86400000,
                //add allday eps
                    eps = 0.016,
                    eventSet,
                    allDayEventInRange = false,
                    normalEventInRange = false,
                    day,
                    hour;

                if (rows.hasEvent) {
                    for (day = 0; day < 7; day += 1) {
                        for (hour = 0; hour < 24; hour += 1) {
                            if (rows[hour][day].events) {
                                rows[hour][day].events = null;
                            }
                        }
                    }
                    rows.hasEvent = false;
                }

                if (dates.hasEvent) {
                    for (day = 0; day < 7; day += 1) {
                        if (dates[day].events) {
                            dates[day].events = null;
                        }
                    }
                    dates.hasEvent = false;
                }

                for (var i = 0; i < len; i += 1) {
                    var event = eventSource[i];
                    var eventStartTime = new Date(event.startTime);
                    var eventEndTime = new Date(event.endTime);

                    if (event.allDay) {
                        if (eventEndTime <= utcStartTime || eventStartTime >= utcEndTime) {
                            continue;
                        } else {
                            allDayEventInRange = true;

                            var allDayStartIndex;
                            if (eventStartTime <= utcStartTime) {
                                allDayStartIndex = 0;
                            } else {
                                allDayStartIndex = Math.floor((eventStartTime - utcStartTime) / oneDay);
                            }

                            var allDayEndIndex;
                            if (eventEndTime >= utcEndTime) {
                                allDayEndIndex = Math.ceil((utcEndTime - utcStartTime) / oneDay);
                            } else {
                                allDayEndIndex = Math.ceil((eventEndTime - utcStartTime) / oneDay);
                            }

                            var displayAllDayEvent = {
                                event: event,
                                startIndex: allDayStartIndex,
                                endIndex: allDayEndIndex
                            };

                            eventSet = dates[allDayStartIndex].events;
                            if (eventSet) {
                                eventSet.push(displayAllDayEvent);
                            } else {
                                eventSet = [];
                                eventSet.push(displayAllDayEvent);
                                dates[allDayStartIndex].events = eventSet;
                            }
                        }
                    } else {
                        if (eventEndTime <= startTime || eventStartTime >= endTime) {
                            continue;
                        } else {
                            normalEventInRange = true;

                            var timeDifferenceStart;
                            if (eventStartTime <= startTime) {
                                timeDifferenceStart = 0;
                            } else {
                                timeDifferenceStart = (eventStartTime - startTime) / oneHour;
                            }

                            var timeDifferenceEnd;
                            if (eventEndTime >= endTime) {
                                timeDifferenceEnd = (endTime - startTime) / oneHour;
                            } else {
                                timeDifferenceEnd = (eventEndTime - startTime) / oneHour;
                            }

                            var startIndex = Math.floor(timeDifferenceStart);
                            var endIndex = Math.ceil(timeDifferenceEnd - eps);
                            var startRowIndex = startIndex % 24;
                            var dayIndex = Math.floor(startIndex / 24);
                            var endOfDay = dayIndex * 24;
                            var endRowIndex;

                            do {
                                endOfDay += 24;
                                if (endOfDay <= endIndex) {
                                    endRowIndex = 24;
                                } else {
                                    endRowIndex = endIndex % 24;
                                }
                                var displayEvent = {
                                    event: event,
                                    startIndex: startRowIndex,
                                    endIndex: endRowIndex
                                };
                                eventSet = rows[startRowIndex][dayIndex].events;
                                if (eventSet) {
                                    eventSet.push(displayEvent);
                                } else {
                                    eventSet = [];
                                    eventSet.push(displayEvent);
                                    rows[startRowIndex][dayIndex].events = eventSet;
                                }
                                startRowIndex = 0;
                                dayIndex += 1;
                            } while (endOfDay < endIndex);
                        }
                    }
                }

                if (normalEventInRange) {
                    for (day = 0; day < 7; day += 1) {
                        var orderedEvents = [];
                        for (hour = 0; hour < 24; hour += 1) {
                            if (rows[hour][day].events) {
                                orderedEvents = orderedEvents.concat(rows[hour][day].events);
                            }
                        }
                        if (orderedEvents.length > 0) {
                            rows.hasEvent = true;
                            ctrl.placeEvents(orderedEvents);
                        }
                    }
                }

                if (allDayEventInRange) {
                    var orderedAllDayEvents = [];
                    for (day = 0; day < 7; day += 1) {
                        if (dates[day].events) {
                            orderedAllDayEvents = orderedAllDayEvents.concat(dates[day].events);
                        }
                    }
                    if (orderedAllDayEvents.length > 0) {
                        dates.hasEvent = true;
                        ctrl.placeAllDayEvents(orderedAllDayEvents);
                    }
                }

                $timeout(function () {
                    updateScrollGutter();
                });
            }

            function _refreshView() {
                var firstDayOfWeek = ctrl.range.startTime,
                    dates = getDates(firstDayOfWeek, 7),
                    weekNumberIndex,
                    weekFormatPattern = 'w',
                    title;

                scope.rows = createDateObjects(firstDayOfWeek);
                scope.dates = dates;
                weekNumberIndex = ctrl.formatWeekTitle.indexOf(weekFormatPattern);
                title = dateFilter(firstDayOfWeek, ctrl.formatWeekTitle);
                if (weekNumberIndex !== -1) {
                    title = title.replace(weekFormatPattern, getISO8601WeekNumber(firstDayOfWeek));
                }
                scope.$parent.title = title;
            }

            function _getRange(currentDate) {
                var year = currentDate.getFullYear(),
                    month = currentDate.getMonth(),
                    date = currentDate.getDate(),
                    day = currentDate.getDay(),
                    firstDayOfWeek = new Date(year, month, date - day),
                    endTime = new Date(year, month, date - day + 7);

                return {
                    startTime: firstDayOfWeek,
                    endTime: endTime
                };
            }

            //This can be decomissioned when upgrade to Angular 1.3
            function getISO8601WeekNumber(date) {
                var checkDate = new Date(date);
                checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7)); // Thursday
                var time = checkDate.getTime();
                checkDate.setMonth(0); // Compare with Jan 1
                checkDate.setDate(1);
                return Math.floor(Math.round((time - checkDate) / 86400000) / 7) + 1;
            }

        }
    }
})();
