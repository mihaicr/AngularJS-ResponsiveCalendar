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
                    var allDayEventBody = children[0].children[1];
                    var allDayEventGutterWidth = allDayEventBody.offsetWidth - allDayEventBody.clientWidth;
                    var normalEventBody = children[1];
                    var normalEventGutterWidth = normalEventBody.offsetWidth - normalEventBody.clientWidth;
                    var gutterWidth = allDayEventGutterWidth || normalEventGutterWidth || 0;
                    if (gutterWidth > 0) {
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

                function createDateObjects(startTime) {
                    var rows = [],
                        time,
                        currentHour = startTime.getHours(),
                        currentDate = startTime.getDate();

                    for (var hour = 0; hour < 24; hour += 1) {
                        time = new Date(startTime.getTime());
                        time.setHours(currentHour + hour);
                        time.setDate(currentDate);
                        rows.push({
                            time: time
                        });
                    }
                    return rows;

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