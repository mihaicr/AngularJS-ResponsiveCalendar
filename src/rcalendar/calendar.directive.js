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

