define([], function(){

  var APIRoot = "http://localhost:3000";

  var Constants = {
    ADD_EVENT: "ADD_EVENT",
    REMOVE_EVENT: "REMOVE_EVENT",
    SIGNIN_EVENT: "SIGNIN_EVENT",
    SIGNOUT_EVENT: "SIGNOUT_EVENT",
    GET_OPTIMIZED_SCHEDULES: "GET_OPTIMIZED_SCHEDULES",
    GET_OPTIMIZED_SCHEDULES_EVENT: "GET_OPTIMIZED_SCHEDULES_EVENT",
    CLEAR_OPTIMIZED_RESULTS: "CLEAR_OPTIMIZED_RESULTS",
    MERGE_RESULTS_TO_CALENDAR: "MERGE_RESULTS_TO_CALENDAR",

    SUCCESS: "success",
    ERROR: "error",

    APIEndpoints: {
      LOGIN:          APIRoot + "/users/sign_in",
      REGISTRATION:   APIRoot + "/users/",
      LOGOUT:        APIRoot + "/users/sign_out",
      OPTIMIZE:      APIRoot + "/events/optimize",
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
    },

    Colors: {
      GREEN: "#1abc9c",
      BLUE: "#3498db",
      DARK_RED: "#eb843d"
    },

    CategoryImagePairs: {
      "meeting": "icon_briefcase.png",
      "hangout": "icon_bubbles.png",
      "work": "icon_imac.png",
      "play": "icon_joypad.png",
      "grooming": "icon_woman.png",
      "date": "icon_man.png",
      "shopping": "icon_package.png",
      "clubbing": "icon_speakers.png",
      "dining": "icon_wine.png"
    }
  };

  return Constants;
});