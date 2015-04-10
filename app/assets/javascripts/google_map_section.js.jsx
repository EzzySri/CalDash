define(['react'], function(React){
  var GoogleMapSection = React.createClass({
    getInitialState: function() {
      return {
      };
    },
    autoResize: function() {
      var map = this.props.googleServiceStoreState.map;
      var center = map.getCenter();
      google.maps.event.trigger(map, "resize");
      map.setCenter(center);
    },
    componentDidMount: function() {
      this.props.flux.actions.googleServiceActions.setMap();
    },
    render: function() {
      return (
        <div id="map-canvas" className="google-map-section col-6" onClick={this.autoResize}></div>
      );
    }
  });
  return GoogleMapSection;
});