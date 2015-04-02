define(['constants'], function(Constants){
  var eventActions = {
    addEvent: function(eventSource) {
      this.dispatch(Constants.ADD_EVENT, {event: eventSource});
    },

    removeEvent: function(eventName) {
      this.dispatch(Constants.REMOVE_EVENT, {eventName: eventName});
    }
  };
  return eventActions;
});