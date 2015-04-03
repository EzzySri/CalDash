require.config({
  paths: {
    react: "react",
    routes: "router",
    react_router: "react_router",

    event_store: "stores/event_store",
    session_store: "stores/session_store",

    session_actions: "actions/session_actions",
    event_actions: "actions/event_actions",
    server_actions: "actions/server_actions",

    web_api_utils: "utils/web_api_utils",
  }
});

// require(['jquery', 'routes', 'react', 'react_router'], function($, routes, React, ReactRouter) {
//   ReactRouter.run(routes, function (Handler) {
//     React.render(<Handler/>, document.getElementById('content'));
//   });
// });

require(['jquery', 'react', 'index', 'fluxxor', 'event_store', 'session_store', 'server_actions', 'session_actions', 'event_actions'],
  function($, React, CalDashApp, Fluxxor, EventStore, SessionStore, serverActions, sessionActions, eventActions) {
  
  $(document).ajaxComplete(function(event, xhr, settings) {
    var csrf_token = xhr.getResponseHeader('X-CSRF-Token');
    if (csrf_token) {
      $('meta[name="csrf-token"]').attr('content', csrf_token);
    }
  });

  var stores = {
    EventStore: new EventStore(),
    SessionStore: new SessionStore()
  };
  var actions = {
    eventActions: eventActions,
    sessionActions: sessionActions,
    serverActions: serverActions
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
