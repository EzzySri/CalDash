define([], function(){

  var APIRoot = "http://localhost:3000";

  var Constants = {
    ADD_EVENT: "ADD_EVENT",
    REMOVE_EVENT: "REMOVE_EVENT",

    APIEndpoints: {
      LOGIN:          APIRoot + "/users/sign_in",
      REGISTRATION:   APIRoot + "/users/sign_up",
      LOGOUT:        APIRoot + "/users/sign_out"
    },

    PayloadSources: {
      SERVER_ACTION: "SERVER_ACTION",
      VIEW_ACTION: "VIEW_ACTION"
    },

    ActionTypes: {
      // Session
      LOGIN: "LOGIN",
      LOGOUT: "LOGOUT",
      SIGNUP: "SIGNUP",
      // Routes
      REDIRECT: "REDIRECT"
    }
  };

  return Constants;
});