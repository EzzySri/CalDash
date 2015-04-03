define(['jquery_ujs', 'jquery', 'fluxxor', 'constants', 'server_actions'], 
  function(_, $, Fluxxor, Constants, ServerActions){
  
  // function _getErrors(res) {
  //   var errorMsgs = ["Something went wrong, please try again"];
  //   if ((json = JSON.parse(res.text))) {
  //     if (json['errors']) {
  //       errorMsgs = json['errors'];
  //     } else if (json['error']) {
  //       errorMsgs = [json['error']];
  //     }
  //   }
  //   return errorMsgs;
  // }

  var APIEndpoints = Constants.APIEndpoints;


  var WebAPIUtils = {

    signup: function(email, username, password, passwordConfirmation) {

      $.ajax({
        url: APIEndpoints.REGISTRATION,
        method: "POST",
        dataType: "json",
        data: {
          user: { 
            email: email, 
            username: username,
            password: password,
            password_confirmation: passwordConfirmation
          }
        }, 
        success: function(data) {
          // json = JSON.parse(res.text);
          // ServerActions.receiveLogin(json, null);
        }.bind(this),
        error: function(xhr, status, err) {
          // var errorMsgs = _getErrors(err);
          // ServerActions.receiveLogin(null, errorMsgs);
        }.bind(this)
      });
      // request.post(APIEndpoints.REGISTRATION)
      // .send({ 
      //   user: { 
      //     email: email, 
      //     username: username,
      //     password: password,
      //     password_confirmation: passwordConfirmation
      //   }
      // })
      // .set('Accept', 'application/json')
      // .end(function(error, res) {
      //   if (res) {
      //     if (res.error) {
      //       var errorMsgs = _getErrors(res);
      //       ServerActions.receiveLogin(null, errorMsgs);
      //     } else {
      //       json = JSON.parse(res.text);
      //       ServerActions.receiveLogin(json, null);
      //     }
      //   }
      // });
    },

    login: function(email, password) {
      $.ajax({
        url: "/users/sign_in",
        method: "POST",
        dataType: "json",
        data: {
          // authenticity_token: $("meta[name='csrf-token']").attr('content'),
          user: {
            email: email, 
            password: password,
            remember_me: 0
          },
          commit: "Log in"
        }, 
        success: function(data) {
          debugger
          // json = JSON.parse(data);
          // ServerActions.receiveLogin(json, null);
        }.bind(this),
        error: function(xhr, status, err) {
          debugger
          // var errorMsgs = _getErrors(err);
          // ServerActions.receiveLogin(null, errorMsgs);
        }.bind(this)
      });
    },

    logout: function() {
      $.ajax({
        url: "/users/sign_out",
        method: "DELETE",
        success: function(data) {
          debugger
          // json = JSON.parse(data);
          // ServerActions.receiveLogin(json, null);
        }.bind(this),
        error: function(xhr, status, err) {
          debugger
          // var errorMsgs = _getErrors(err);
          // ServerActions.receiveLogin(null, errorMsgs);
        }.bind(this)
      });      
    }
  };
  return WebAPIUtils;
});