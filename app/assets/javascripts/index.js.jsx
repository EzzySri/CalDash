define(['react', 'moment', 'full_calendar', 'navigation_panel', 'error_message', 'add_new_event_section', 'google_map_section'],
  function(React, _, FullCalendar, NavigationPanel, ErrorMessage, AddNewEventSection, GoogleMapSection) {
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
        mode: "view-mode",
        logisticsPage: null,
        logisticsPageLabel: "",
        errorMessage: "",
        errorMessageRandom: 0
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
    switchMode: function(event) {
      this.setState({mode: event.target.id});
    },
    submitSignUpForm: function() {

    },
    submitSignInForm: function() {

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
              <button className="generic-field-container user-sign-in-button submit-text" type="button" onClick={this.submitSignInForm}> Submit </button>
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
              <button className="generic-field-container new-user-submit-button submit-text" type="button" onClick={this.submitSignUpForm}> Submit </button>
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
    displayErrorMessage: function(message) {
      if ($(".error-message-container").css("height") == "0px") {
        this.setState({errorMessage: message, errorMessageRandom: Math.random()});
      }
    },
    render: function() {
      var rightComponent;
      
      var viewScheduleButtonClass = "task-button";
      var manageEventsButtonClass = "task-button";
      var resultsButtonClass = "task-button";
      switch (this.state.mode) {
        case "view-mode":
          viewScheduleButtonClass += " task-button-pressed";
          rightComponent = (<FullCalendar onChangeDayView={this.changeDayView} />);
          break;
        case "events-mode":
          manageEventsButtonClass += " task-button-pressed";
          rightComponent = (<ScheduledEvents onDeleteEvent={this.deleteEvent} data={this.state.data} />);
          break;
        default:
          resultsButtonClass += " task-button-pressed";
          rightComponent = (<OptimizedSchedule selectedDay={this.state.selectedDay} />);
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
              <div className="">
                <ErrorMessage errorMessage={this.state.errorMessage} errorMessageRandom={this.state.errorMessageRandom} />
              </div>
              <div className="col-sm-8"></div>
              <div className="col-sm-4">
                <div className="row">
                  <div className="col-sm-4 col-0-gutter">
                      <div id="results-mode" className={resultsButtonClass} onClick={this.switchMode}> View Results </div>
                  </div>
                  <div className="col-sm-4 col-0-gutter">
                    <div id="view-mode" className={viewScheduleButtonClass} onClick={this.switchMode}> View Schedule </div>
                  </div>
                  <div className="col-sm-4 col-0-gutter">
                    <div id="events-mode" className={manageEventsButtonClass} onClick={this.switchMode}> Manage Events </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row show-grid">
            <div className="col-sm-4">
              <div className="show-grid">
                <AddNewEventSection didError={this.displayErrorMessage} onLocationSelected={this.retrieveGeoLocation} newPredictions={this.state.predictions} selectedDay={this.state.selectedDay} onLocationInputChange={this.retrieveMapPredictions} onAddEvent={this.addToScheduledEvents}/>
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
  return CalDashApp;
});