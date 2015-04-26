define(['event_history_list', 'steps_bar', 'constants', 'optimized_schedule', 'scheduled_events', 'event_store', 'session_store', 'fluxxor', 'react', 'moment', 'full_calendar', 'navigation_panel', 'error_message', 'add_new_event_section', 'google_map_section'],
  function(EventHistoryList, StepsBar, Constants, OptimizedSchedule, ScheduledEvents, _, _, Fluxxor, React, moment, FullCalendar, NavigationPanel, ErrorMessage, AddNewEventSection, GoogleMapSection) {
  
  var FluxMixin = Fluxxor.FluxMixin(React);
  var StoreWatchMixin = Fluxxor.StoreWatchMixin;

  var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

  var CalDashApp = React.createClass({

    mixins: [FluxMixin, StoreWatchMixin("EventFormStore", "EventStore", "SessionStore", "PredictionStore", "ApplicationStore", "FlashMessageStore", "GoogleServiceStore")],

    getStateFromFlux: function() {
      var flux = this.getFlux();
      return {
        eventStoreState: flux.store('EventStore').getState(),
        sessionStoreState: flux.store('SessionStore').getState(),
        predictionStoreState: flux.store('PredictionStore').getState(),
        googleServiceStoreState: flux.store('GoogleServiceStore').getState(),
        applicationStoreState: flux.store("ApplicationStore").getState(),
        flashMessageStoreState: flux.store("FlashMessageStore").getState(),
        eventFormStoreState: flux.store("EventFormStore").getState()
      };
    },
    getSelectedDay: function() {
      return this.getStateFromFlux().applicationStoreState.selectedDay;
    },
    switchMode: function(event) {
      this.getFlux().actions.applicationActions.setMode(event.target.id);
    },
    submitSignUpForm: function() {
      var fullName = this.refs.newName.getDOMNode().value;
      var email = this.refs.newEmail.getDOMNode().value;
      var password = this.refs.newPassword.getDOMNode().value;
      var passwordConfirmation = this.refs.newPasswordConfirmation.getDOMNode().value;
      if (!(fullName && email && password && passwordConfirmation)) {
        this.getFlux().actions.flashMessageActions.displayFlashMessage("All fields are required.", "error", Math.random());
        this.afterSignUp(Constants.ERROR);
        return;
      }
      this.getFlux().actions.sessionActions.signup(fullName, email, password, passwordConfirmation)
    },
    submitSignInForm: function() {
      var email = this.refs.email.getDOMNode().value;
      var password = this.refs.password.getDOMNode().value;
      if (!(email && password)) {
        this.getFlux().actions.flashMessageActions.displayFlashMessage("All fields are required.", "error", Math.random());
        this.afterSignIn(Constants.ERROR);
        return;
      }
      this.getFlux().actions.sessionActions.login(email, password);
    },
    handleSignIn: function() {
      if (this.getStateFromFlux().applicationStoreState.logisticsPageLabel == "signIn") {
        this.getFlux().actions.applicationActions.setLogisticsPageLabel("");
      } else {
        this.getFlux().actions.applicationActions.setLogisticsPageLabel("signIn");
      }
    },
    handleViewProfile: function() {
      if (this.getStateFromFlux().applicationStoreState.logisticsPageLabel == "myProfile") {
        this.getFlux().actions.applicationActions.setLogisticsPageLabel("");
      } else {
        this.getFlux().actions.applicationActions.setLogisticsPageLabel("myProfile");
      }
    },
    afterSignIn: function(status) {
      if (status == Constants.SUCCESS) {
        this.refs.email.getDOMNode().value = "";
        this.getFlux().actions.applicationActions.setLogisticsPageLabel("");
      }
      this.refs.password.getDOMNode().value = "";
    },
    afterSignUp: function(status) {
      if (status == Constants.SUCCESS) {
        this.refs.newName.getDOMNode().value = "";
        this.refs.newEmail.getDOMNode().value = "";
        this.getFlux().actions.applicationActions.setLogisticsPageLabel("");
      }
      this.refs.newPassword.getDOMNode().value = "";
      this.refs.newPasswordConfirmation.getDOMNode().value = "";
    },
    handleSignUp: function() {
      if (this.getStateFromFlux().applicationStoreState.logisticsPageLabel == "signUp") {
        this.getFlux().actions.applicationActions.setLogisticsPageLabel("");
      } else {
        this.getFlux().actions.applicationActions.setLogisticsPageLabel("signUp");
      }
    },
    handleSignOut: function() {
      this.getFlux().actions.sessionActions.logout();
    },
    componentDidMount: function() {
      this.getFlux().store("SessionStore").on(Constants.SIGNIN_EVENT, this.afterSignIn);
      this.getFlux().store("SessionStore").on(Constants.SIGNUP_EVENT, this.afterSignUp);
    },
    changeDate: function(diffInDays) {
      newDate = this.getSelectedDay().add(diffInDays, 'days');
      this.getFlux().actions.applicationActions.setSelectedDay(newDate);
    },
    render: function() {
      var rightComponent;
      var manageEventsButtonClass = "task-button";
      var resultsButtonClass = "task-button";

      switch (this.getStateFromFlux().applicationStoreState.mode) {
        case "events-mode":
          manageEventsButtonClass += " task-button-pressed";
          rightComponent =
            (<ScheduledEvents
              flux={this.getFlux()}
              stepExplanationCollapsed={this.getStateFromFlux().applicationStoreState.stepExplanationCollapsed}
              selectedDay={this.getSelectedDay()}
              events={this.getStateFromFlux().eventStoreState.events} />);
          break;
        default:
          resultsButtonClass += " task-button-pressed";
          rightComponent =
            (<OptimizedSchedule
              flux={this.getFlux()}
              applicationStoreState={this.getStateFromFlux().applicationStoreState}
              stepExplanationCollapsed={this.getStateFromFlux().applicationStoreState.stepExplanationCollapsed}
              results = {this.getStateFromFlux().eventStoreState.optimizedResults}
              selectedDay={this.getSelectedDay()} />);
      }

      var logisticsPageLabel = this.getStateFromFlux().applicationStoreState.logisticsPageLabel;
      return (
        <div className="container">
          <div className="event-history-list-container">
            <EventHistoryList
              flux={this.getFlux()}
              applicationStoreState={this.getStateFromFlux().applicationStoreState}
              eventStoreState={this.getStateFromFlux().eventStoreState} />
          </div>
          <div className="row full-extend-white-background">
            <NavigationPanel
              isSignedIn={this.getFlux().store('SessionStore').isLoggedIn()}
              onViewProfile={this.handleViewProfile} onSignUp={this.handleSignUp}
              onSignIn={this.handleSignIn} onSignOut={this.handleSignOut}/>
          </div>
          <div className="logistics-section row" ref="logisticsSection">
            <ReactCSSTransitionGroup transitionName="logistics-page">
              {this.fetchLogisticsPage(logisticsPageLabel)}
            </ReactCSSTransitionGroup>
          </div>
          <div className="row show-grid">
            <div className="task-panel col-sm-12">
              <div className="">
                <ErrorMessage flashMessageStoreState={this.getStateFromFlux().flashMessageStoreState} />
              </div>
              <div className="col-sm-8"></div>
              <div className="col-sm-4">
                <div className="row">
                  <div className="col-sm-4 col-0-gutter">
                    <div id="events-mode" className={manageEventsButtonClass} onClick={this.switchMode}> Manage Events </div>
                  </div>
                  <div className="col-sm-4 col-0-gutter">
                      <div id="results-mode" className={resultsButtonClass} onClick={this.switchMode}> View Results </div>
                  </div>
                  <div className="col-sm-4 col-0-gutter">
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row show-grid">
            <div className="col-sm-4">
              <div className="show-grid">
                <AddNewEventSection
                  flux = {this.getFlux()}
                  applicationStoreState={this.getStateFromFlux().applicationStoreState}
                  eventFormStoreState={this.getStateFromFlux().eventFormStoreState}
                  eventStoreState={this.getStateFromFlux().eventStoreState}
                  newPredictions={this.getStateFromFlux().predictionStoreState.predictions}
                  selectedDay={this.getSelectedDay()} />
              </div>
              <GoogleMapSection
                flux={this.getFlux()}
                applicationStoreState={this.getStateFromFlux().applicationStoreState}
                googleServiceStoreState={this.getStateFromFlux().googleServiceStoreState} />
            </div>
            <div className="col-sm-8">
              {this.getStateFromFlux().applicationStoreState.moreCalendar ? (
                  <FullCalendar
                    flux={this.getFlux()}
                    eventStoreState={this.getStateFromFlux().eventStoreState}
                    applicationStoreState={this.getStateFromFlux().applicationStoreState}
                    events={flux.store('EventStore').getMandatoryEvents()}
                    onChangeDate={this.changeDate} />
                ) : (
                  <div className="row">
                    <div className="col-sm-6">
                      <StepsBar
                        flux={this.getFlux()}
                        applicationStoreState={this.getStateFromFlux().applicationStoreState} />
                      {rightComponent}
                    </div>
                    <div className="col-sm-6">
                      <FullCalendar
                        flux={this.getFlux()}
                        eventStoreState={this.getStateFromFlux().eventStoreState}
                        applicationStoreState={this.getStateFromFlux().applicationStoreState}
                        events={flux.store('EventStore').getMandatoryEvents()}
                        onChangeDate={this.changeDate} />
                    </div>
                  </div>
                )
              }
            </div>
          </div>
        </div>
      );
    },
    fetchLogisticsPage: function(logisticsPageLabel) {
      var logisticsPage;
      switch (logisticsPageLabel) {
        case "signIn":
          logisticsPage = (
            <div key={logisticsPageLabel} className="full-extend-blue-background sign-in-section">
              <div className="col-sm-4"></div>
              <div className="col-sm-4 vert-ctr">
                <div>
                  <div className="user-email-text"> Email </div>
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
            <div key={logisticsPageLabel} className="sign-up-section full-extend-green-background">
              <div className="col-sm-4"></div>
              <div className="col-sm-4 vert-ctr">
                <div>
                  <div className="user-name-text"> Name </div>
                  <input className="generic-field-container user-name-input" ref="newName" placeholder="e.g Liam Lin" type="text" />
                </div>
                <div>
                  <div className="user-email-text"> Email </div>
                  <input className="generic-field-container" ref="newEmail" type="text" />
                </div>
                <div>
                  <div className="user-password-text"> Password </div>
                  <input className="generic-field-container" ref="newPassword" type="password" />
                </div>
                <div>
                  <div className="user-password-text"> Password Confirmation </div>
                  <input className="generic-field-container" ref="newPasswordConfirmation" type="password" />
                </div>
                <div>
                  <button className="generic-field-container new-user-submit-button submit-text" type="button" onClick={this.submitSignUpForm}> Submit </button>
                </div>
              </div>
              <div className="col-sm-4"></div>
            </div>
          );
          break;
        case "myProfile":
          logisticsPage = (
            <div key={logisticsPageLabel} className="my-profile-section full-extend-dark-red-background">
            </div>
          );
          break;
        default:
      }
      return logisticsPage;
    },
  });
  return CalDashApp;
});