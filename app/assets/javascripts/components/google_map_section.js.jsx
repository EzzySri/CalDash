var GoogleMapSection = React.createClass({
  getInitialState: function() {
    return {
      map: null
    };
  },
  initialize: function() {
    var mapOptions = {
      zoom: 14
    }, map = this.state.map;
    if (!map) {
      map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      this.setState({map: map});
      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = new google.maps.LatLng(position.coords.latitude,
                                           position.coords.longitude);
          var infowindow = new google.maps.InfoWindow({
            map: map,
            position: pos,
            content: 'You are here.'
          });
          map.setCenter(pos);
        }, function() {
          this.handleNoGeolocation(map, true);
        }.bind(this));
      } else {
        // Browser doesn't support Geolocation
        this.handleNoGeolocation(map, false);
      }
    }
  },
  displayNewGeoLocationResult: function() {
    if (this.props.newGeoLocationResult) {
      var map = this.state.map;
      var result = this.props.newGeoLocationResult;
      map.setCenter(result.geometry.location);
      var marker = new google.maps.Marker({
        map: map,
        position: result.geometry.location,
        title: result.formatted_address
      });
    }
  },
  handleNoGeolocation: function(map, errorFlag) {
    if (errorFlag) {
      var content = 'Error: The Geolocation service failed.';
    } else {
      var content = 'Error: Your browser doesn\'t support geolocation.';
    }
    var options = {
      map: map,
      position: new google.maps.LatLng(60, 105),
      content: content
    };
    

    var infowindow = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
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
    // this looks like a hack
    this.displayNewGeoLocationResult();
    return (
      <div id="map-canvas" className="google-map-section col-6" onClick={this.autoResize}></div>
    );
  }
});
