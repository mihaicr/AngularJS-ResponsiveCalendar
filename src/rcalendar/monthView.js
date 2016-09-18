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
