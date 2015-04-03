define(['constants', 'web_api_utils'], function(Constants, WebAPIUtils){
  var sessionActions = {
     
    signup: function(payload) {
      WebAPIUtils.signup(payload.email, payload.username, payload.password, payload.passwordConfirmation);
    },

    login: function(email, password) {
      WebAPIUtils.login(email, password);
    },

    logout: function() {
      WebAPIUtils.logout();
      // this.dispatch(ActionTypes.LOGOUT_REQUEST, {});
    }

  };
  return sessionActions;
});