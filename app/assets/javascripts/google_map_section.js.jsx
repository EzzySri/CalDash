define(['react'], function(React){
  var GoogleMapSection = React.createClass({
    getInitialState: function() {
      return {
      };
    },
    autoResizeInteractiveMap: function() {
      var map = this.props.googleServiceStoreState.map;
      var center = map.getCenter();
      google.maps.event.trigger(map, "resize");
      map.setCenter(center);
    },
    autoResizeResultMap: function() {
      var map = this.props.googleServiceStoreState.resultMap;
      var center = map.getCenter();
      google.maps.event.trigger(map, "resize");
      map.setCenter(center);
    },
    componentDidMount: function() {
      this.props.flux.actions.googleServiceActions.setMap();
      this.props.flux.actions.googleServiceActions.setResultMap();
      this.props.flux.actions.googleServiceActions.displayRoutesForDay();
    },
    render: function() {
      var mapContainer = this.props.applicationStoreState.mapMode == "interactive-mode" ? <div id="interactive-map" className="google-map-section col-6" onClick={this.autoResizeInteractiveMap}></div> : <div id="result-map" className="google-map-section col-6" onClick={this.autoResizeResultMap}></div>;
      var interactiveMapShouldHide = this.props.applicationStoreState.mapMode != "interactive-mode" ? {display: "none"} : {};
      var resultMapShouldHide = this.props.applicationStoreState.mapMode != "result-mode" ? {display: "none"} : {};
      return (
        <div>
          <div className="interactive-map-container" style={interactiveMapShouldHide}>
            <div id="interactive-map" className="google-map-section col-6" onClick={this.autoResizeInteractiveMap}></div>
          </div>
          <div className="result-map-container" style={resultMapShouldHide}>        
            <div id="result-map" className="google-map-section col-6" onClick={this.autoResizeResultMap}></div>
          </div>
        </div>
      );
    }
  });
  return GoogleMapSection;
});