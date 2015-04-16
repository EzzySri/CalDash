define(['jquery', 'fluxxor', 'constants', 'moment'], function($, Fluxxor, Constants, moment){
  var ApplicationStore = Fluxxor.createStore({
    initialize: function() {
      this.selectedDay = moment();
      
      this.selectedWeekDays = [];
      // this method prepares the two variables above
      this.prepareMultiSelectInWeek();

      this.calendarMode = "day-mode";
      this.moreCalendar = false;
      this.stepExplanationCollapsed = false;
      this.explanationVisible = true;
      this.stepCount = 0;
      this.mode = "events-mode";
      this.logisticsPageLabel = "";
      this.eventHistoryListCollapsed = false;

      var ActionTypes = Constants.ActionTypes;

      this.bindActions(
        ActionTypes.SET_CALENDAR_MODE, this.onSetCalendarMode,
        ActionTypes.SET_SELECTED_DAY, this.onSetSelectedDay,
        ActionTypes.CALENDAR_EXPAND, this.onCalendarExpand,
        ActionTypes.CALENDAR_COLLAPSE, this.onCalendarCollapse,
        ActionTypes.STEP_EXPLANATION_EXPAND, this.onStepExplanationExpand,
        ActionTypes.STEP_EXPLANATION_COLLAPSE, this.onStepExplanationCollapse,
        ActionTypes.SET_STEP_COUNT, this.onSetStepCount,
        ActionTypes.SET_MODE, this.onSetMode,
        ActionTypes.EVENT_HISTORY_LIST_EXPAND, this.onEventHistoryListExpand,
        ActionTypes.EVENT_HISTORY_LIST_COLLAPSE, this.onEventHistoryListCollapse,
        ActionTypes.SET_LOGISTICS_PAGE_LABEL, this.onSetLogisticsPageLabel,
        ActionTypes.TOGGLE_DAY_IN_WEEK, this.onToggleDayInWeek
      );
    },

    prepareMultiSelectInWeek: function() {
      var startOfWeek = moment(this.selectedDay).startOf("week");
      this.selectedWeekDays = new Array(7);
      for (var i = 0; i < 7; i += 1) {
        var newDay = moment(startOfWeek).add(i, "day");
        this.selectedWeekDays[i] = newDay - (this.selectedDay).startOf("day") == 0;
      }
    },

    onToggleDayInWeek: function(payload) {
      if (this.selectedDay.isoWeekday() != payload.dayIndex) {
        this.selectedWeekDays[payload.dayIndex] = !this.selectedWeekDays[payload.dayIndex];
        this.emit("change");
      }
    },

    onEventHistoryListCollapse: function() {
      this.eventHistoryListCollapsed = true;
      this.emit("change");
    },

    onSetLogisticsPageLabel: function(payload) {
      this.logisticsPageLabel = payload.label;
      this.emit("change");
    },

    onEventHistoryListExpand: function() {
      this.eventHistoryListCollapsed = false;
      this.emit("change");
    },

    onSetCalendarMode: function(payload) {
      this.calendarMode = payload.calendarMode;
      this.emit("change");
    },

    onSetMode: function(payload) {
      this.mode = payload.mode;
      this.emit("change");
    },

    onSetSelectedDay: function(payload) {
      this.selectedDay = payload.selectedDay;
      this.prepareMultiSelectInWeek();
      this.emit("change");
    },

    onSetStepCount: function(payload) {
      this.stepCount = payload.stepCount;
      this.emit("change");
    },

    onCalendarExpand: function() {
      this.moreCalendar = true;
      this.emit("change");
    },

    onCalendarCollapse: function() {
      this.moreCalendar = false;
      this.emit("change");
    },

    onStepExplanationExpand: function() {
      this.moreCalendar = false;
      this.stepExplanationCollapsed = false;
      this.explanationVisible = true;
      this.emit("change");
    },    

    onStepExplanationCollapse: function() {
      this.moreCalendar = false;
      this.stepExplanationCollapsed = true;
      this.explanationVisible = false;
      this.emit("change");
    },

    getState: function() {
      return {
        selectedDay: this.selectedDay,
        moreCalendar: this.moreCalendar,
        stepExplanationCollapsed: this.stepExplanationCollapsed,
        explanationVisible: this.explanationVisible,
        stepCount: this.stepCount,
        mode: this.mode,
        calendarMode: this.calendarMode,
        eventHistoryListCollapsed: this.eventHistoryListCollapsed,
        logisticsPageLabel: this.logisticsPageLabel,
        selectedWeekDays: this.selectedWeekDays
      };
    }
  });
  return ApplicationStore;
});