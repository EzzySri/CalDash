define(['react_router', 'index'], function(ReactRouter, CalDashApp) {
  var Route = ReactRouter.Route;
  var DefaultRoute = Route.DefaultRoute;
  var routes = (
    <Route path="/" handler={CalDashApp}></Route>
  );
  return routes;
});