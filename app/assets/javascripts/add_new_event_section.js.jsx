define(['constants', 'react', 'moment', 'prediction_list'], function(Constants, React, moment, PredictionList) {
  
  var AddNewEventSection = React.createClass({
    toggleMandatory: function() {
      var currentEventInput = this.props.eventStoreState.currentEventInput;
      if (currentEventInput.mandatory) {
        this.props.flux.actions.eventActions.setMandatory(false);
      } else {
        this.props.flux.actions.eventActions.setMandatory(true);
      }
    },
    handleForWhichDays: function(event) {
      this.props.flux.actions.applicationActions.toggleDayInWeek(parseInt(event.target.id));
    },
    handleLocationInputChange: function() {
      var loc = this.refs.locationInput.getDOMNode().value;
      this.props.flux.actions.googleServiceActions.retrieveMapPredictions(loc);
    },
    handleLocationChoice: function(event) {
      var loc = event.target.innerHTML;
      this.props.flux.actions.eventActions.setLocation(loc);
      this.refs.locationInput.getDOMNode().value = loc;
      this.props.flux.actions.predictionActions.clearPredictions();
      if (this.props.eventStoreState.currentEventInput.location) {
        this.props.flux.actions.googleServiceActions.retrieveGeoLocation();
      }
    },
    render: function() {
      var times = this.props.eventFormStoreState.timeOptions;
      var momentStrFormat = "Do, h:mm a";
      var timeOptions = times.map(function(momentObj) {
        return (
          <option value={momentObj.valueOf()}>{momentObj.format(momentStrFormat)}</option>
        );
      });
      var beforeTimeOptions = times.map(function(momentObj) {
        return (
          <option value={momentObj.valueOf()}>{"before " + momentObj.format(momentStrFormat)}</option>
        );
      });
      var afterTimeOptions = times.map(function(momentObj) {
        return (
          <option value={momentObj.valueOf()}>{"after " + momentObj.format(momentStrFormat)}</option>
        );
      });

      var durations = this.props.eventFormStoreState.durationOptions;
      var durationOptions = durations.map(function(durationObj) {
        return (
          <option value={durationObj.valueOf()}>{durationObj.humanize()}</option>
        );
      });
      var selectedDay = this.props.applicationStoreState.selectedDay;
      var multiDaySelect = this.props.applicationStoreState.selectedWeekDays.map(function(selected, index){
        var color = selected ? Constants.Colors.BLUE : ""; 
        return (
          <li id={index} style={{backgroundColor:color}} onClick={this.handleForWhichDays}>{selectedDay.day(index).format("ddd") + "."}</li>
        );
      }, this);
      var notMandatorySection = (
        <div className="not-mandatory-section">
          <div className="col-sm-6 after-time-container">
            <select
              onChange={this.setAfterTime}
              value={this.props.eventStoreState.currentEventInput.after.valueOf()}
              className="generic-field-container">
              {afterTimeOptions}
            </select>
          </div>
          <div className="col-sm-6 before-time-container">
            <select
              onChange={this.setBeforeTime}
              value={this.props.eventStoreState.currentEventInput.before.valueOf()}
              className="generic-field-container">
              {beforeTimeOptions}
            </select>
          </div>
          <div className="col-sm-6 duration-container">
            <select
              onChange={this.setDuration}
              value={this.props.eventStoreState.currentEventInput.duration.valueOf()}
              className="generic-field-container">
              {durationOptions}
            </select>
          </div>
        </div>
      );
      var firstDayWeek = this.props.applicationStoreState.selectedDay.startOf("week");
      var mandatorySection = (
        <div className="not-mandatory-section">
          <div className="col-sm-6 from-time-container">
            <select
              onChange={this.setStartTime}
              value={this.props.eventStoreState.currentEventInput.start.valueOf()}
              className="generic-field-container">
              {timeOptions}
            </select>
          </div>
          <div className="col-sm-6 to-time-container">
            <select
              onChange={this.setEndTime}
              value={this.props.eventStoreState.currentEventInput.end.valueOf()}
              className="generic-field-container">
              {timeOptions}
            </select>
          </div>
          <div className="event-day-list">
            <div className="row">
              {multiDaySelect}
            </div>
          </div>
        </div>
      );
      var timeRangeSection;
      var timeRangeSectionText;
      if (this.props.eventStoreState.currentEventInput.mandatory) {
        timeRangeSectionText = "Fixed Time Range"
        timeRangeSection = mandatorySection;
      } else {
        timeRangeSectionText = "Desired Time Constraints & Duration"
        timeRangeSection = notMandatorySection;
      }

      var mandButtonClass = "generic-field-container";
      var notMandButtonClass = "generic-field-container";
      if (this.props.eventStoreState.currentEventInput.mandatory) {
        mandButtonClass += " pressed";
      } else {
        notMandButtonClass += " pressed";
      }

      var categoryOptions = Object.keys(Constants.CategoryImagePairs).map(function(cat) {
          return (
            <option value={cat}>{cat}</option>
          );
        }
      );

      return (
        <div className="add-new-event-container">
          <form onSubmit={this.handleSubmit}>
            <div className="new-event-form-upper">
              <div>
                <div className="event-name-text"> Event Name & Category </div>
                <div className="col-sm-6 event-name-container">
                  <input className="generic-field-container" type="text" value={this.props.eventStoreState.currentEventInput.title} onChange={this.setTitle} />
                </div>
                <div className="col-sm-6 category-select-container">
                  <select value={this.props.eventStoreState.currentEventInput.category} onChange={this.setCategory} className="generic-field-container">
                    <option value="placeholder" disabled>Select a category</option>
                    {categoryOptions}
                  </select>
                </div>
              </div>
              <div>
                <div className="is-mandatory-text" onClick={this.toggleTimeInputMenus}> Mandatory Event </div>
                <div className="col-sm-6 mandatory-button">
                  <button className={mandButtonClass} type="button" onClick={this.toggleMandatory}>Yes</button>
                </div>
                <div className="col-sm-6 not-mandatory-button">
                  <button className={notMandButtonClass} type="button" onClick={this.toggleMandatory}>No</button>
                </div>
              </div>
              <div>
                <div className="date-duration-text">{timeRangeSectionText}</div>
                {timeRangeSection}
              </div>
            </div>
            <div className="new-event-form-lower">
              <div>
                <div className="location-text"> Location </div>
                <input className="generic-field-container" type="text" ref="locationInput" onChange={this.handleLocationInputChange} />
              </div>
              <PredictionList
                onLocationChoice={this.handleLocationChoice}
                newPredictions={this.props.newPredictions} />
              <div>
                <div className="evnet-description-text"> Description </div>
                <input
                  value={this.props.eventStoreState.currentEventInput.eventDescription}
                  onChange={this.setEventDescription}
                  className="generic-field-container"
                  type="text" />
              </div>
            </div>
            <div>
              <button className="new-event-submit-button" type="button" onClick={this.props.flux.actions.eventActions.addEvent}>Add</button>
            </div>
          </form>
        </div>
      );
    },
    setTitle: function(event){
      this.props.flux.actions.eventActions.setTitle(event.target.value);
    },
    setCategory: function(event){
      this.props.flux.actions.eventActions.setCategory(event.target.value);
    },
    setAfterTime: function(event) {
      this.props.flux.actions.eventActions.setAfterTime(moment(parseInt(event.target.value)));
    },
    setBeforeTime: function(event) {
      this.props.flux.actions.eventActions.setBeforeTime(moment(parseInt(event.target.value)));
    },
    setStartTime: function(event) {
      this.props.flux.actions.eventActions.setStartTime(moment(parseInt(event.target.value)));
    },
    setEndTime: function(event) {
      this.props.flux.actions.eventActions.setEndTime(moment(parseInt(event.target.value)));
    },
    setDuration: function(event) {
      this.props.flux.actions.eventActions.setDuration(moment.duration(parseInt(event.target.value)));
    },
    setEventDescription: function(event) {
      this.props.flux.actions.eventActions.setEventDescription(event.target.value);
    }
  });
  return AddNewEventSection;
});