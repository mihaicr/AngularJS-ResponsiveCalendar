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
