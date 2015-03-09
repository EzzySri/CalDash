var CalDashApp = React.createClass({
  getInitialState: function() {
    return {
      data: [],
      selectedDay: moment(),
      predictions: [],
      locationService: null
    };
  },
  addToScheduledEvents: function(eventSource) {
    this.state.data.push(eventSource);
    this.setState({data: this.state.data});
  },
  changeDayView: function(date) {
    this.setState({selectedDay:date});
  },
  retrieveMapPredictions: function(loc) {
    var service;
    if (!this.state.locationService) {
      service = new google.maps.places.AutocompleteService();
      this.setState({locationService: service});
    }
    if (loc != "") {
      this.state.locationService.getQueryPredictions({input: loc}, this.sendPredictions);
    } else {
      this.setState({predictions: []});  
    }
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
      <div className="index-container">
        <div className="grid">
          <div className="fr">
            <UserProfile url="test_user_profile.json"/>
          </div>
        </div>
        <div className="grid">
          <FullCalendar onChangeDayView={this.changeDayView} />
          <GoogleMapSection locationInput={this.state.locationInput}/>
        </div>
        <div className="grid">
          <AddNewEventSection newPredictions={this.state.predictions} selectedDay={this.state.selectedDay} onLocationInputChange={this.retrieveMapPredictions} onAddEvent={this.addToScheduledEvents}/>
          <ScheduledEvents data={this.state.data} />
        </div>
      </div>
    );
  }
});

React.render(
  <CalDashApp />,
  document.getElementById('content')
);