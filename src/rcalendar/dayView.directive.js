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