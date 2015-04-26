define([], function(){

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

    RECENT_EVENT_COUNT: 5,

    APIEndpoints: {
      LOGIN:          "/users/sign_in",
      REGISTRATION:   "/users/",
      LOGOUT:        "/users/sign_out",
      OPTIMIZE:      "/event_assignments/optimize",
      FETCH_DAY_EVENTS: "/event_assignments/fetch_day_events",
      BATCH_FETCH_EVENTS: "/event_assignments/batch_fetch_events",
      EVENT_ASSIGNMENTS_BATCH_CREATE: "/event_assignments/batch_create",
      FETCH_RECENT_EVENTS: "/event_assignments"
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

      CHECK_AND_REDIRECT: "CHECK_AND_REDIRECT",

      SET_NAME: "SET_NAME",
      SET_CATEGORY: "SET_CATEGORY",
      SET_AFTER_TIME: "SET_AFTER_TIME",
      SET_BEFORE_TIME: "SET_BEFORE_TIME",
      SET_START_TIME: "SET_START_TIME", 
      SET_END_TIME: "SET_END_TIME",
      SET_DURATION: "SET_DURATION",
      SET_EVENT_DESCRIPTION: "SET_EVENT_DESCRIPTION",
      SET_LOGISTICS_PAGE_LABEL: "SET_LOGISTICS_PAGE_LABEL",
      SYNC_SCHEDULE_CHOICE: "SYNC_SCHEDULE_CHOICE",
      BATCH_FETCH_EVENTS: "BATCH_FETCH_EVENTS",
      SET_ROUTES_FOR_DAY: "SET_ROUTES_FOR_DAY",
      DISPLAY_ROUTES_FOR_DAY: "DISPLAY_ROUTES_FOR_DAY",

      SET_PREDICTIONS: "SET_PREDICTIONS",
      CLEAR_PREDICTIONS: "CLEAR_PREDICTIONS",

      SET_LOCATION: "SET_LOCATION",
      SET_MANDATORY: "SET_MANDATORY",

      SET_GEOCODER_SERVICE: "SET_GEOCODER_SERVICE",
      SET_LOCATION_SERVICE: "SET_LOCATION_SERVICE",
      RETRIEVE_GEO_LOCATION: "RETRIEVE_GEO_LOCATION",
      SET_MAP: "SET_MAP",
      SET_RESULT_MAP: "SET_RESULT_MAP",
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
      TOGGLE_DAY_IN_WEEK: "TOGGLE_DAY_IN_WEEK",
      TOGGLE_MAP_MODE: "TOGGLE_MAP_MODE",

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
      MAP_MARKER: gon.image_tags.map_marker,
      MAP_BLACK_MARKER: gon.image_tags.map_black_marker,
      ARROW_LEFT: gon.image_tags.arrow_left_icon,
      ARROW_DOWN: gon.image_tags.arrow_down_icon,
      ARROW_RIGHT: gon.image_tags.arrow_right_icon,
      STEP_1: gon.image_tags.step1_icon,
      STEP_2: gon.image_tags.step2_icon,
      STEP_3: gon.image_tags.step3_icon
    },

    CategoryImagePairs: {
      "meeting": gon.image_tags.meeting_icon,
      "hangout": gon.image_tags.hangout_icon,
      "work": gon.image_tags.work_icon,
      "play": gon.image_tags.play_icon,
      "grooming": gon.image_tags.grooming_icon,
      "date": gon.image_tags.date_icon,
      "shopping": gon.image_tags.shopping_icon,
      "clubbing": gon.image_tags.clubbing_icon,
      "dining": gon.image_tags.dining_icon,
    }
  };

  return Constants;
});