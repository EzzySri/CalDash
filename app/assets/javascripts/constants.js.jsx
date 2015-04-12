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
      REDIRECT: "REDIRECT",

      SET_PREDICTIONS: "SET_PREDICTIONS",
      CLEAR_PREDICTIONS: "CLEAR_PREDICTIONS",

      SET_LOCATION: "SET_LOCATION",
      SET_MANDATORY: "SET_MANDATORY",

      SET_GEOCODER_SERVICE: "SET_GEOCODER_SERVICE",
      SET_LOCATION_SERVICE: "SET_LOCATION_SERVICE",
      RETRIEVE_GEO_LOCATION: "RETRIEVE_GEO_LOCATION",
      SET_MAP: "SET_MAP",
      RETRIEVE_MAP_PREDICTIONS: "RETRIEVE_MAP_PREDICTIONS",

      SET_CALENDAR_MODE: "SET_CALENDAR_MODE",
      SET_SELECTED_DAY: "SET_SELECTED_DAY",
      CALENDAR_EXPAND: "CALENDAR_EXPAND",
      CALENDAR_COLLAPSE: "CALENDAR_COLLAPSE",
      STEP_EXPLANATION_EXPAND: "STEP_EXPLANATION_EXPAND",
      STEP_EXPLANATION_COLLAPSE: "STEP_EXPLANATION_COLLAPSE",
      SET_STEP_COUNT: "SET_STEP_COUNT",
      SET_MODE: "SET_MODE",
      EVENT_HISTORY_LIST_EXPAND: "EVENT_HISTORY_LIST_EXPAND",
      EVENT_HISTORY_LIST_COLLAPSE: "EVENT_HISTORY_LIST_COLLAPSE",

      DISPLAY_FLASH_MESSAGE: "DISPLAY_FLASH_MESSAGE",
      CLEAR_FLASH_MESSAGE: "CLEAR_FLASH_MESSAGE"
    },

    FlashMessages: {
      NO_EVENTS_TO_OPTIMIZE: "You have no events to optimize."
    },

    Colors: {
      GREEN: "#1abc9c",
      BLUE: "#3498db",
      DARK_RED: "#eb843d"
    },

    Images: {
      MAP_MARKER: "assets/icon_map_marker.png"
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