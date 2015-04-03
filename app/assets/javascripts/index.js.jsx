define(['constants', 'optimized_schedule', 'scheduled_events', 'event_store', 'session_store', 'fluxxor', 'react', 'moment', 'full_calendar', 'navigation_panel', 'error_message', 'add_new_event_section', 'google_map_section'],
  function(Constants, OptimizedSchedule, ScheduledEvents, _, _, Fluxxor, React, moment, FullCalendar, NavigationPanel, ErrorMessage, AddNewEventSection, GoogleMapSection) {
  
  var FluxMixin = Fluxxor.FluxMixin(React);
  var StoreWatchMixin = Fluxxor.StoreWatchMixin;

  var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

  var CalDashApp = React.createClass({

    mixins: [FluxMixin, StoreWatchMixin("EventStore", "SessionStore")],

    getInitialState: function() {
      return {
        selectedDay: moment(),
        predictions: [],
        newGeoLocationResult: null,
        locationService: null,
        geocoderService: null,
        mode: "view-mode",
        logisticsPageLabel: "",
        errorMessage: "",
        errorMessageRandom: 0
      };
    },
    getStateFromFlux: function() {
      var flux = this.getFlux();
      return {
        eventStoreState: flux.store('EventStore').getState(),
        sessionStoreState: flux.store('SessionStore').getState()
      };
    },
    addToScheduledEvents: function(eventSource) {
      this.getFlux().actions.eventActions.addEvent(eventSource);
    },
    deleteEvent: function(titleText) {
      this.getFlux().actions.eventActions.removeEvent(titleText);
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
      var email = this.refs.email.getDOMNode().value;
      var password = this.refs.password.getDOMNode().value;
      this.getFlux().actions.sessionActions.login(email, password);
    },
    handleSignIn: function() {
      if (this.state.logisticsPageLabel == "signIn") {
        this.setState({logisticsPageLabel: ""});
      } else {
        this.setState({logisticsPageLabel: "signIn"});
      }
    },
    afterSignIn: function(status) {
      if (status == Constants.SUCCESS) {
        this.refs.email.getDOMNode().value = "";
        this.refs.password.getDOMNode().value = "";
        this.setState({logisticsPageLabel: ""});
      }
    },
    handleSignUp: function() {
      if (this.state.logisticsPageLabel == "signUp") {
        this.setState({logisticsPageLabel: ""});
      } else {
        this.setState({logisticsPageLabel: "signUp"});
      }
    },
    handleSignOut: function() {
      this.getFlux().actions.sessionActions.logout();
    },
    displayErrorMessage: function(message) {
      if ($(".error-message-container").css("height") == "0px") {
        this.setState({errorMessage: message, errorMessageRandom: Math.random()});
      }
    },
    componentDidMount: function() {
      this.getFlux().store("SessionStore").on(Constants.SIGNIN_EVENT, this.afterSignIn);
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
          rightComponent = (<ScheduledEvents onDeleteEvent={this.deleteEvent} data={this.getStateFromFlux().events} />);
          break;
        default:
          resultsButtonClass += " task-button-pressed";
          rightComponent = (<OptimizedSchedule selectedDay={this.state.selectedDay} />);
      }

      var logisticsPage;
      switch (this.state.logisticsPageLabel) {
        case "signIn":
          logisticsPage = (
            <div key={this.state.logisticsPageLabel} className="full-extend-blue-background sign-in-section">
              <div className="col-sm-4"></div>
              <div className="col-sm-4 vert-ctr">
                <div>
                  <div className="user-account-text"> Account </div>
                  <input className="generic-field-container" type="text" ref="email"/>
                </div>
                <div>
                  <div className="user-password-text"> Password </div>
                  <input className="generic-field-container" type="password" ref="password"/>
                </div>
                <div>
                  <button className="generic-field-container user-sign-in-button submit-text" type="button" onClick={this.submitSignInForm}> Submit </button>
                </div>
                <div className="col-sm-4"></div>
              </div>
            </div>
          );
          break;
        case "signUp":
          logisticsPage = (
            <div key={this.state.logisticsPageLabel} className="sign-up-section full-extend-green-background">
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
        default:
      }

      return (
        <div className="container">
          <div className="row full-extend-white-background">
            <NavigationPanel isSignedIn={this.getFlux().store('SessionStore').isLoggedIn()} onSignUp={this.handleSignUp} onSignIn={this.handleSignIn} onSignOut={this.handleSignOut}/>
          </div>
          <div className="logistics-section row" ref="logisticsSection">
            <ReactCSSTransitionGroup transitionName="logistics-page">
              {logisticsPage}
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