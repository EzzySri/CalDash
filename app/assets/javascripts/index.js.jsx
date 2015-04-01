var CalDashApp = React.createClass({
  getInitialState: function() {
    return {
      data: [],
      selectedDay: moment(),
      predictions: [],
      newGeoLocationResult: null,
      locationService: null,
      geocoderService: null,
      isViewMode: true
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
  toViewMode: function() {
    if (!this.state.isViewMode) {
      this.setState({isViewMode: true});
    }
  },
  toScheduleMode: function() {
    if (this.state.isViewMode) {
      this.setState({isViewMode: false});
    }
  },
  render: function() {
    var rightComponent = this.state.isViewMode ? (<FullCalendar onChangeDayView={this.changeDayView} />) : (<ScheduledEvents data={this.state.data} />);
    
    return (
      <div className="container">
        <div className="row full-extend-white-background">
          <NavigationPanel />
        </div>
        <div className="row show-grid">
          <div className="task-panel col-sm-12">
            <div className="col-sm-9"></div>
            <div className="col-sm-3">
              <div className="row">
                <div className="col-sm-6 col-0-gutter">
                  <div className="task-button" onClick={this.toViewMode}> View Schedule </div>
                </div>
                <div className="col-sm-6 col-0-gutter">
                  <div className="task-button" onClick={this.toScheduleMode}> Manage Events </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row show-grid">
          <div className="col-sm-4">
            <div className="show-grid">
              <AddNewEventSection onLocationSelected={this.retrieveGeoLocation} newPredictions={this.state.predictions} selectedDay={this.state.selectedDay} onLocationInputChange={this.retrieveMapPredictions} onAddEvent={this.addToScheduledEvents}/>
            </div>
            <GoogleMapSection newGeoLocationResult={this.state.newGeoLocationResult} locationInput={this.state.locationInput}/>
          </div>
          <div className="col-sm-8">
            {rightComponent}
          </div>
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
