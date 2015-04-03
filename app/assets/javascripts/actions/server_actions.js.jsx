define(["constants", 'fluxxor'], function(Constants, Fluxxor){
  var ActionTypes = Constants.ActionTypes;

  var ServerActions = {
    receiveLogin: function(json, errors) {
      this.dispatch(Constants.LOGIN_RESPONSE, {json: json, errors: errors});
    },
  };
});