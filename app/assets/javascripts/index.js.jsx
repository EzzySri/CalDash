var CalDashApp = React.createClass({
  getInitialState: function() {
    return {
      data: [],
      selectedDay: moment(),
      predictions: [],
      newGeoLocationResult: null,
      locationService: null,
      geocoderService: null
    };
  },
  addToScheduledEvents: function(eventSource) {
    this.state.data.push(eventSource);
    this.setState({data: this.state.data});
  },
  changeDayView: function(date) {
    this.setState({selectedDay:date});
  },
  retrieveGeoLocation: function(loc) {
    var context = this;
    var service = this.state.geocoderService,
      new_states = {};
    if (!service) {
      service = new google.maps.Geocoder();
      new_states["geocoderService"] = service;
    }
    service.geocode({ 'address': loc}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        context.setState({newGeoLocationResult: results[0]});
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
    this.setState(new_states);
  },
  retrieveMapPredictions: function(loc) {
    var service = this.state.locationService,
        new_states = {};

    if (!service) {
      service = new google.maps.places.AutocompleteService();
      new_states["locationService"] = service;
    }

    if (loc != "") {
      service.getQueryPredictions({input: loc}, this.sendPredictions);
    } else {
      new_states['predictions'] = []
    }

    this.setState(new_states);
  },
  sendPredictions: function(predictions, status) {
    if (status != google.maps.places.PlacesServiceStatus.OK) {
      alert(status);
      return;
    }
    this.setState({predictions: predictions});
  },
  render: function() {
    return (
      <div className="container">
        <div className="row show-grid full-extend-white-background">
          <NavigationPanel />
        </div>
        <div className="row show-grid">
          <div className="col-sm-4">
            <AddNewEventSection onLocationSelected={this.retrieveGeoLocation} newPredictions={this.state.predictions} selectedDay={this.state.selectedDay} onLocationInputChange={this.retrieveMapPredictions} onAddEvent={this.addToScheduledEvents}/>
          </div>
          <div className="col-sm-4">
            <FullCalendar onChangeDayView={this.changeDayView} />
          </div>
          <div className="col-sm-4">
            <GoogleMapSection newGeoLocationResult={this.state.newGeoLocationResult} locationInput={this.state.locationInput}/>
          </div>
        </div>
        <div className="row show-grid">
          <ScheduledEvents data={this.state.data} />
        </div>
      </div>
    );
  }
});


$(document).ready(function () {
  React.render(
    <CalDashApp />,
    document.getElementById('content')
  );
});
