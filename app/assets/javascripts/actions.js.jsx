define(['constants'], function(Constants){

  var actions = {
    applicationActions: {
      setCalendarMode: function(mode) {
        this.dispatch(Constants.ActionTypes.SET_CALENDAR_MODE, {calendarMode: mode});
      },
      setSelectedDay: function(day) {
        this.dispatch(Constants.ActionTypes.SET_SELECTED_DAY, {selectedDay: day});
      },
      calendarExpand: function() {
        this.dispatch(Constants.ActionTypes.CALENDAR_EXPAND, {});
      },
      calendarCollapse: function() {
        this.dispatch(Constants.ActionTypes.CALENDAR_COLLAPSE, {});
      },
      stepExplanationExpand: function() {
        this.dispatch(Constants.ActionTypes.STEP_EXPLANATION_EXPAND, {});
      },
      stepExplanationCollapse: function() {
        this.dispatch(Constants.ActionTypes.STEP_EXPLANATION_COLLAPSE, {});
      },
      setStepCount: function(count) {
        this.dispatch(Constants.ActionTypes.SET_STEP_COUNT, {stepCount: count});
      },
      setMode: function(mode) {
        this.dispatch(Constants.ActionTypes.SET_MODE, {mode: mode});
      },
      eventHistoryListExpand: function() {
        this.dispatch(Constants.ActionTypes.EVENT_HISTORY_LIST_EXPAND, {});
      },
      eventHistoryListCollapse: function() {
        this.dispatch(Constants.ActionTypes.EVENT_HISTORY_LIST_COLLAPSE, {});
      }
    },
    eventActions: {
      addEvent: function(eventSource) {
        this.dispatch(Constants.ADD_EVENT, {event: eventSource});
      },
      removeEvent: function(eventName) {
        this.dispatch(Constants.REMOVE_EVENT, eventName);
      },
      getOptimizedSchedules: function() {
        this.dispatch(Constants.GET_OPTIMIZED_SCHEDULES, {});
      },
      mergeResultsToCalendar: function() {
        this.dispatch(Constants.MERGE_RESULTS_TO_CALENDAR, {});
      },
      clearOptimizedResults: function() {
        this.dispatch(Constants.CLEAR_OPTIMIZED_RESULTS, {});
      },
      setLocation: function(loc) {
        this.dispatch(Constants.ActionTypes.SET_LOCATION, {location: loc});
      },
      setMandatory: function(isMandatory) {
        this.dispatch(Constants.ActionTypes.SET_MANDATORY, {mandatory: isMandatory});
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
    },
    predictionActions: {
      setPredictions: function(locationInput, predictions) {
        this.dispatch(Constants.ActionTypes.SET_PREDICTIONS, {locationInput: locationInput, predictions: predictions});
      },
      clearPredictions: function() {
        this.dispatch(Constants.ActionTypes.CLEAR_PREDICTIONS, {});
      }
    },
    googleServiceActions: {
      setGeocoderService: function(geocoderService) {
        this.dispatch(Constants.ActionTypes.SET_GEOCODER_SERVICE, {geocoderService: geocoderService});
      },
      setLocationService: function(locationService) {
        this.dispatch(Constants.ActionTypes.SET_LOCATION_SERVICE, {locationService: locationService});
      },
      retrieveGeoLocation: function() {
        this.dispatch(Constants.ActionTypes.RETRIEVE_GEO_LOCATION, {});
      },
      setMap: function(){
        this.dispatch(Constants.ActionTypes.SET_MAP, {});
      },
      retrieveMapPredictions: function(loc) {
        this.dispatch(Constants.ActionTypes.RETRIEVE_MAP_PREDICTIONS, {locationInput: loc});
      }
    },
    flashMessageActions: {
      displayFlashMessage: function(message, type, random) {
        this.dispatch(Constants.ActionTypes.DISPLAY_FLASH_MESSAGE, {flashMessage: message, flashMessageType: type, random: random});
      },
      clearFlashMessage: function() {
        this.dispatch(Constants.ActionTypes.CLEAR_FLASH_MESSAGE, {});
      }
    }
  };
  return actions;
});