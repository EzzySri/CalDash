define(['jquery', 'fluxxor', 'constants'], function($, Fluxxor, Constants){

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

      this.bindActions(
        Constants.ActionTypes.LOGIN_RESPONSE, this.onLoginResponse,
        Constants.ActionTypes.LOGOUT_REQUEST, this.onLogoutRequest
      );
    },

    emitChange: function() {
      this.emit(CHANGE_EVENT);
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

    onLoginResponse: function(payload) {
      if (payload.json && payload.json.access_token) {
        this.email = action.json.email;
        this.name = action.json.name;
        this.isSignedIn = true;
        // Token will always live in the session, so that the API can grab it with no hassle
        // sessionStorage.setItem('accessToken', _accessToken);
        // sessionStorage.setItem('email', _email);
      }
      if (action.errors) {
        this.errors = action.errors;
      }
      this.emitChange();
    },

    onLogoutRequest: function() {
      this.email = null;
      this.name = null;
      this.isSignedIn = false;
      // sessionStorage.removeItem("email");
      // sessionStorage.removeItem('');
      SessionStore.emitChange();
    },
  });
  return SessionStore;
});