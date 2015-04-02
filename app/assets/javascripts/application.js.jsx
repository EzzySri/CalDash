require.config({
  paths: {
    react: "react",
    routes: "router",
    react_router: "react_router",
    event_store: "stores/event_store"
  }
});

// require(['jquery', 'routes', 'react', 'react_router'], function($, routes, React, ReactRouter) {
//   ReactRouter.run(routes, function (Handler) {
//     React.render(<Handler/>, document.getElementById('content'));
//   });
// });

require(['jquery', 'react', 'index', 'fluxxor', 'event_store', 'event_actions'], function($, React, CalDashApp, Fluxxor, EventStore, eventActions) {
  var stores = {
    EventStore: new EventStore()
  };
  var actions = {
    eventActions: eventActions
  }
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
