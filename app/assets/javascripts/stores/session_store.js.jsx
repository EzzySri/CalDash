define(['jquery_ujs', 'jquery', 'fluxxor', 'constants'], function(_, $, Fluxxor, Constants){


  var ActionTypes = Constants.ActionTypes;
  var CHANGE_EVENT = 'change';

  var _errors = [];


  var SessionStore = Fluxxor.createStore({
    initialize: function() {
      this.errors = [];

      this.isSignedIn = false;

      this.email = null;
      this.name = null;
      this.userId = null;

      if ($("meta[name=current-user]").length > 0) {
        var userInfo = JSON.parse($("meta[name=current-user]").attr("content"));
        var data = {
          id: userInfo.id,
          email: userInfo.email,
          first_name: userInfo.first_name,
          last_name: userInfo.last_name
        };
        this.onLoginResponse({json: data, errors: null});
      }

      this.bindActions(
        Constants.ActionTypes.LOGIN, this.onLogin,
        Constants.ActionTypes.LOGOUT, this.onLogout,
        Constants.ActionTypes.SIGNUP, this.onSignup,
        Constants.ActionTypes.CHECK_AND_REDIRECT, this.onCheckAndRedirect
      );
    },

    checkAndRedirect: function() {
      if (!this.isSignedIn) {
        this.flux.store("ApplicationStore").onSetLogisticsPageLabel({label: "signIn"});
        this.flux.store("FlashMessageStore").onDisplayFlashMessage({
            flashMessage: "Please log in to proceed.",
            flashMessageType: "error",
            random: Math.random()});
        return false;
      }
      return true;
    },

    onCheckAndRedirect: function() {
      this.checkAndRedirect();
      this.emit("change");
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
      this.emitChange();
    },

    onSignup: function(payload) {

      email = payload.email;
      fullName = payload.name.split(" ");
      password = payload.password;
      passwordConfirmation = payload.passwordConfirmation;

      $.ajax({
        url: Constants.APIEndpoints.REGISTRATION,
        method: "POST",
        dataType: "json",
        data: {
          user: { 
            email: email, 
            first_name: fullName[0],
            last_name: fullName[1],
            password: password,
            password_confirmation: passwordConfirmation
          }
        }, 
        success: function(data) {
          this.onLoginResponse({json: data, errors: null});
          this.flux.store("ApplicationStore").onSetLogisticsPageLabel({label: ""});
          this.flux.store("FlashMessageStore").onDisplayFlashMessage({
            flashMessage: "You have signed up successfully.",
            flashMessageType: "notice",
            random: Math.random()});
          this.emit(Constants.SIGNUP_EVENT, Constants.SUCCESS);
        }.bind(this),
        error: function(xhr, status, err) {
          this.flux.store("FlashMessageStore").onDisplayFlashMessage({
            flashMessage: "Signup was not successful for the following reason: " + err,
            flashMessageType: "error",
            random: Math.random()});
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
            remember_me: 1
          },
          commit: "Log in"
        }, 
        success: function(data) {
          this.onLoginResponse({json: data, errors: null});
          this.flux.store("FlashMessageStore").onDisplayFlashMessage({
            flashMessage: "You are signed in successfully.",
            flashMessageType: "notice",
            random: Math.random()});
          this.flux.store("ApplicationStore").onSetLogisticsPageLabel({label: ""});
          this.emit(Constants.SIGNIN_EVENT, Constants.SUCCESS);
        }.bind(this),
        error: function(xhr, status, err) {
          this.flux.store("FlashMessageStore").onDisplayFlashMessage({
            flashMessage: "Login was not successful for the following reason: " + err,
            flashMessageType: "error",
            random: Math.random()});
        }.bind(this)
      });
    },

    onLogout: function(payload) {
      $.ajax({
        url: "/users/sign_out",
        method: "DELETE",
        success: function(data) {
          this.onLogoutResponse({json: null, errors: null});
          this.flux.store("FlashMessageStore").onDisplayFlashMessage({
            flashMessage: "You have logged out.",
            flashMessageType: "notice",
            random: Math.random()});
        }.bind(this),
        error: function(xhr, status, err) {
          this.flux.store("FlashMessageStore").onDisplayFlashMessage({
            flashMessage: "Logout was not successful for the following reason: " + err,
            flashMessageType: "error",
            random: Math.random()});
        }.bind(this)
      });
    }
  });
  return SessionStore;
});