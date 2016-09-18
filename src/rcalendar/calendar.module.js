(function () {
    'use strict';

    angular
        .module('ui.rCalendar', [])
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
            showAllDayEventHeader: true
        });
})();
