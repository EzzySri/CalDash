require.config({
  paths: {
    react: "react",
    routes: "router",
    react_router: "react_router",

    event_store: "stores/event_store",
    session_store: "stores/session_store",
    prediction_store: "stores/prediction_store",
    google_service_store: "stores/google_service_store",
    application_store: "stores/application_store",
    flash_message_store: "stores/flash_message_store",

    web_api_utils: "utils/web_api_utils"
  }
});

// require(['jquery', 'routes', 'react', 'react_router'], function($, routes, React, ReactRouter) {
//   ReactRouter.run(routes, function (Handler) {
//     React.render(<Handler/>, document.getElementById('content'));
//   });
// });

require(['jquery', 'react', 'index', 'fluxxor', 'flash_message_store', 'application_store', 'google_service_store', 'prediction_store', 'event_store', 'session_store', 'actions'],
  function($, React, CalDashApp, Fluxxor, FlashMessageStore, ApplicationStore, GoogleServiceStore, PredictionStore, EventStore, SessionStore, actions) {
  
  $(document).ajaxComplete(function(event, xhr, settings) {
    var csrf_token = xhr.getResponseHeader('X-CSRF-Token');
    if (csrf_token) {
      $('meta[name="csrf-token"]').attr('content', csrf_token);
    }
  });

  var stores = {
    EventStore: new EventStore(),
    SessionStore: new SessionStore(),
    PredictionStore: new PredictionStore(),
    GoogleServiceStore: new GoogleServiceStore(),
    ApplicationStore: new ApplicationStore(),
    FlashMessageStore: new FlashMessageStore()
  };

  var flux = new Fluxxor.Flux(stores, actions);
  window.flux = flux;

  flux.on("dispatch", function(type, payload) {
    if (console && console.log) {
      console.log("[Dispatch]", type, payload);
    }
  });

  React.render(
    <CalDashApp flux={flux}/>,
    document.getElementById('content')
  );
});
