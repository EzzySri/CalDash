define(['constants'], function(Constants){

  var actions = {
    eventActions: {
      addEvent: function(eventSource) {
        this.dispatch(Constants.ADD_EVENT, {event: eventSource});
      },
      removeEvent: function(eventName) {
        this.dispatch(Constants.REMOVE_EVENT, eventName);
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