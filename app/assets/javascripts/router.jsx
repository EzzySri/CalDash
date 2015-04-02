var Route = ReactRouter.Route;
var DefaultRoute = Route.DefaultRoute;

var routes = (
  <Route path="/" handler={CalDashApp}></Route>
);

ReactRouter.run(routes, function (Handler) {
  React.render(<Handler/>, document.getElementById('content'));
});