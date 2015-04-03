define(['jquery_ujs', 'jquery', 'fluxxor', 'constants'], function(_, $, Fluxxor, Constants){


  var ActionTypes = Constants.ActionTypes;
  var CHANGE_EVENT = 'change';

  var _accessToken = sessionStorage.getItem('accessToken')
  var _email = sessionStorage.getItem('email')
  var _errors = [];


  var SessionStore = Fluxxor.createStore({
    initialize: function() {
      this.errors = [];

      this.isSignedIn = false;

      this.email = null;
      this.name = null;
      this.userId = null;

      this.bindActions(
        Constants.ActionTypes.LOGIN, this.onLogin,
        Constants.ActionTypes.LOGOUT, this.onLogout,
        Constants.ActionTypes.SIGNUP, this.onSignup
      );
    },

    emitChange: function() {
      this.emit(CHANGE_EVENT);
    },

    addSuccessListener: function(callback) {
      this.on(SUCCESS_EVENT, callback);
    },

    addChangeListener: function(callback) {
      this.on(CHANGE_EVENT, callback);
    },

    removeChangeListener: function(callback) {
      this.removeListener(CHANGE_EVENT, callback);
    },

    isLoggedIn: function() {
      return this.isSignedIn;    
    },

    getEmail: function() {
      return this.email;
    },

    getName: function() {
      return this.name;
    },

    getErrors: function() {
      return this.errors;
    },

    getState: function() {
      return {
        errors: this.errors,
        isSignedIn: this.isSignedIn,
        email: this.email,
        name: this.name,
        userId: this.userId
      };
    },

    onLoginResponse: function(payload) {
      if (payload.json) {
        this.userId = payload.json.id
        this.email = payload.json.email;
        this.name = payload.json.first_name + " " + payload.json.last_name;
        this.isSignedIn = true;
        // Token will always live in the session, so that the API can grab it with no hassle
        // sessionStorage.setItem('accessToken', _accessToken);
        // sessionStorage.setItem('email', _email);
      }
      if (payload.errors) {
        this.errors = payload.errors;
      }
      this.emitChange();
    },

    onLogoutResponse: function(payload) {
      this.email = null;
      this.name = null;
      this.userId = null;
      this.isSignedIn = false;
      // sessionStorage.removeItem("email");
      // sessionStorage.removeItem('');
      this.emitChange();
    },

    onSignup: function(payload) {

      email = payload.email;
      username = payload.username;
      password = payload.password;
      passwordConfirmation = payload.passwordConfirmation;

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
          this.emit(Constants.SIGNIN_EVENT, Constants.SUCCESS);
          // ServerActions.receiveLogin(json, null);
        }.bind(this),
        error: function(xhr, status, err) {
          // var errorMsgs = _getErrors(err);
          // ServerActions.receiveLogin(null, errorMsgs);
        }.bind(this)
      });
    },

    onLogin: function(payload) {

      var email = payload.email;
      var password = payload.password;

      $.ajax({
        url: "/users/sign_in",
        method: "POST",
        dataType: "json",
        data: {
          user: {
            email: email, 
            password: password,
            remember_me: 0
          },
          commit: "Log in"
        }, 
        success: function(data) {
          this.onLoginResponse({json: data, errors: null});
          this.emit(Constants.SIGNIN_EVENT, Constants.SUCCESS);
        }.bind(this),
        error: function(xhr, status, err) {
          // var errorMsgs = _getErrors(err);
          // ServerActions.receiveLogin(null, errorMsgs);
        }.bind(this)
      });
    },

    onLogout: function(payload) {
      $.ajax({
        url: "/users/sign_out",
        method: "DELETE",
        success: function(data) {
          this.onLogoutResponse({json: null, errors: null});
        }.bind(this),
        error: function(xhr, status, err) {
          // var errorMsgs = _getErrors(err);
          // ServerActions.receiveLogin(null, errorMsgs);
        }.bind(this)
      });
    }
  });
  return SessionStore;
});