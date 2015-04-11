define(['jquery', 'fluxxor', 'constants', 'moment'], function($, Fluxxor, Constants, moment){
  var ApplicationStore = Fluxxor.createStore({
    initialize: function() {
      this.selectedDay = moment();
      this.moreCalendar = false;
      this.stepExplanationCollapsed = false;
      this.explanationVisible = true;
      this.stepCount = 0;

      var ActionTypes = Constants.ActionTypes;

      this.bindActions(
        ActionTypes.SET_SELECTED_DAY, this.onSetSelectedDay,
        ActionTypes.CALENDAR_EXPAND, this.onCalendarExpand,
        ActionTypes.CALENDAR_COLLAPSE, this.onCalendarCollapse,
        ActionTypes.STEP_EXPLANATION_EXPAND, this.onStepExplanationExpand,
        ActionTypes.STEP_EXPLANATION_COLLAPSE, this.onStepExplanationCollapse,
        ActionTypes.SET_STEP_COUNT, this.onSetStepCount
      );
    },

    onSetSelectedDay: function(payload) {
      this.selectedDay = payload.selectedDay;
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
        stepCount: this.stepCount
      };
    }
  });
  return ApplicationStore;
});