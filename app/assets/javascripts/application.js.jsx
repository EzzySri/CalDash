require.config({
  paths: {
    react: "react",
    routes: "router",
    react_router: "react_router"
  }
});

// require(['jquery', 'routes', 'react', 'react_router'], function($, routes, React, ReactRouter) {
//   ReactRouter.run(routes, function (Handler) {
//     React.render(<Handler/>, document.getElementById('content'));
//   });
// });

require(['jquery', 'react', 'index'], function($, React, CalDashApp) {
  React.render(
    <CalDashApp />,
    document.getElementById('content')
  );
});
