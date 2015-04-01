var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var CalDashApp = React.createClass({
  getInitialState: function() {
    return {
      data: [],
      selectedDay: moment(),
      predictions: [],
      newGeoLocationResult: null,
      locationService: null,
      geocoderService: null,
      isViewMode: true,
      logisticsPage: null,
      logisticsPageLabel: ""
    };
  },
  addToScheduledEvents: function(eventSource) {
    this.state.data.push(eventSource);
    this.setState({data: this.state.data});
  },
  deleteEvent: function(titleText) {
    eSources = this.state.data;
    for (i = 0; i < eSources.length; i += 1) {
      e = this.state.data[i];
      if (e.title == titleText) {
        eSources.splice(i, 1);
        this.setState({data:eSources});
        return
      }
    }
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
  handleSignUp: function() {

  },
  handleSignIn: function() {

  },
  handleSignIn: function() {
    signInPage = (
      <div className="full-extend-blue-background sign-in-section">
        <div className="col-sm-4"></div>
        <div className="col-sm-4 vert-ctr">
          <div>
            <div className="user-account-text"> Account </div>
            <input className="generic-field-container" type="text" />
          </div>
          <div>
            <div className="user-password-text"> Password </div>
            <input className="generic-field-container" type="password" />
          </div>
          <div>
            <button className="generic-field-container user-sign-in-button submit-text" type="button" onClick={this.handleSignIn}> Submit </button>
          </div>
          <div className="col-sm-4"></div>
        </div>
      </div>
    );
    if (this.state.logisticsPageLabel == "signIn") {
      this.setState({logisticsPage: null, logisticsPageLabel: ""});
    } else {
      this.setState({logisticsPage: signInPage, logisticsPageLabel: "signIn"});
    }
  },
  handleSignUp: function() {
    signUpPage = (
      <div className="sign-up-section full-extend-green-background">
        <div className="col-sm-4"></div>
        <div className="col-sm-4 vert-ctr">
          <div>
            <div className="user-name-text"> Name </div>
            <input className="generic-field-container" type="text" />
          </div>
          <div>
            <div className="user-account-text"> Account </div>
            <input className="generic-field-container" type="text" />
          </div>
          <div>
            <div className="user-password-text"> Password </div>
            <input className="generic-field-container" type="password" />
          </div>
          <div>
            <button className="generic-field-container new-user-submit-button submit-text" type="button" onClick={this.handleSignUp}> Submit </button>
          </div>
        </div>
        <div className="col-sm-4"></div>
      </div>
    );
    if (this.state.logisticsPageLabel == "signUp") {
      this.setState({logisticsPage: null, logisticsPageLabel: ""});
    } else {
      this.setState({logisticsPage: signUpPage, logisticsPageLabel: "signUp"});
    }
  },
  toScheduleMode: function() {
    if (this.state.isViewMode) {
      this.setState({isViewMode: false});
    }
  },
  render: function() {
    var rightComponent = this.state.isViewMode ? (<FullCalendar onChangeDayView={this.changeDayView} />) : (<ScheduledEvents onDeleteEvent={this.deleteEvent} data={this.state.data} />);
    
    var viewScheduleButtonClass = "task-button";
    var manageEventsButtonClass = "task-button";
    if (this.state.isViewMode) {
      viewScheduleButtonClass += " task-button-pressed";
    } else {
      manageEventsButtonClass += " task-button-pressed";
    }

    return (
      <div className="container">
        <div className="row full-extend-white-background">
          <NavigationPanel onSignUp={this.handleSignUp} onSignIn={this.handleSignIn}/>
        </div>
        <div className="logistics-section row" ref="logisticsSection">
          <ReactCSSTransitionGroup transitionName="logistics-page">
            {this.state.logisticsPage}
          </ReactCSSTransitionGroup>
        </div>

        <div className="row show-grid">
          <div className="task-panel col-sm-12">
            <div className="col-sm-9"></div>
            <div className="col-sm-3">
              <div className="row">
                <div className="col-sm-6 col-0-gutter">
                  <div className={viewScheduleButtonClass} onClick={this.toViewMode}> View Schedule </div>
                </div>
                <div className="col-sm-6 col-0-gutter">
                  <div className={manageEventsButtonClass} onClick={this.toScheduleMode}> Manage Events </div>
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
