var GoogleMapSection = React.createClass({
  getInitialState: function() {
    return {
      map: null
    };
  },
  initialize: function() {
    var mapOptions = {
      center: {lat: -34.397, lng: 150.644},
      zoom: 8
    };
    var map;
    if (!this.state.map) {
      map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      this.setState({map: map});
    }
  },
  autoResize: function() {
    var map = this.state.map;
    var center = map.getCenter();
    google.maps.event.trigger(map, "resize");
    map.setCenter(center);
  },
  componentDidMount: function() {
    this.initialize();
  },
  render: function() {
    return (
      <div id="map-canvas" className="google-map-section col-1-2" onClick={this.autoResize}></div>
    );
  }
});
