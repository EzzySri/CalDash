define(['constants'], function(Constants){

  var actions = {
    eventActions: {
      addEvent: function(eventSource) {
        this.dispatch(Constants.ADD_EVENT, {event: eventSource});
      },
      removeEvent: function(eventName) {
        this.dispatch(Constants.REMOVE_EVENT, eventName);
      },
      getOptimizedSchedules: function(date) {
        this.dispatch(Constants.GET_OPTIMIZED_SCHEDULES, date);
      },
      mergeResultsToCalendar: function() {
        this.dispatch(Constants.MERGE_RESULTS_TO_CALENDAR, {});
      },
      clearOptimizedResults: function() {
        this.dispatch(Constants.CLEAR_OPTIMIZED_RESULTS, {});
      }
    },
    sessionActions: {
     
      signup: function(name, email, password, passwordConfirmation) {
        this.dispatch(Constants.ActionTypes.SIGNUP, {email: email, name: name, password: password, passwordConfirmation: passwordConfirmation});
      },
      login: function(email, password) {
        this.dispatch(Constants.ActionTypes.LOGIN, {email: email, password: password});
      },
      logout: function() {
        this.dispatch(Constants.ActionTypes.LOGOUT, {});
      }
    }
  };
  return actions;
});