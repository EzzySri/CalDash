define(['constants', 'react', 'moment', 'prediction_list'], function(Constants, React, moment, PredictionList) {
  
  var AddNewEventSection = React.createClass({
    getInitialState: function() {
      return {
        forWhichDays: new Set()
      };
    },
    getCurrentEventInput: function() {
      return this.props.eventStoreState.currentEventInput;
    },
    handleAdd: function() {
      var currentEventInput = this.getCurrentEventInput();
      var eventSource, momentFrom, momentTo, momentBefore, momentAfter, eventDescription;
      var title = this.refs.eventName.getDOMNode().value.trim();
      var category = this.refs.categorySelect.getDOMNode().value.trim();
      if (!(title && category != "placeholder")) {
        this.props.flux.actions.flashMessageActions.displayFlashMessage("Event Name and Category should not be empty.", "error", Math.random());
        return
      }
      eventDescription = this.refs.eventDescription.getDOMNode().value.trim(); 
      if (currentEventInput.mandatory) {
        momentFrom = moment(parseInt(this.refs.fromTime.getDOMNode().value));
        momentTo = moment(parseInt(this.refs.toTime.getDOMNode().value));
        if (momentFrom >= momentTo) {
          this.props.flux.actions.flashMessageActions.displayFlashMessage("Starting time should not be after or equal to ending time.", "error", Math.random());
          return   
        }
        eventSource = {
          start: momentFrom, 
          end: momentTo
        }
      } else {
        momentBefore = moment(parseInt(this.refs.beforeTime.getDOMNode().value));
        momentAfter = moment(parseInt(this.refs.afterTime.getDOMNode().value));
        if (momentBefore <= momentAfter) {
          this.props.flux.actions.flashMessageActions.displayFlashMessage("Before Estimate should not be less than or equal to After Estimate.", "error", Math.random());
          return   
        }
        eventSource = {
          duration: moment.duration(parseInt(this.refs.duration.getDOMNode().value)),
          before: momentBefore, 
          after: momentAfter
        }
      }
      eventSource["eventDescription"] = eventDescription;
      eventSource["title"] = title;
      eventSource["category"] = category;
      this.props.flux.actions.eventActions.addEvent(eventSource);
    },
    isMandatory: function() {
      var currentEventInput = this.props.eventStoreState.currentEventInput;
      if (!currentEventInput.mandatory) {
        this.props.flux.actions.eventActions.setMandatory(true);
      }
    },
    isNotMandatory: function() {
      var currentEventInput = this.props.eventStoreState.currentEventInput;
      if (currentEventInput.mandatory) {
        this.props.flux.actions.eventActions.setMandatory(false);
      }
    },
    handleForWhichDays: function(event) {
      var inner = event.target;
      // TO-DO: decide what to do with multiple days add
      if (inner.style.backgroundColor == 'red') {
        inner.style.backgroundColor = '';
        this.state.forWhichDays.add(inner.innerHTML());
      } else {
        event.target.style.backgroundColor = 'red';
        this.state.forWhichDays.delete(inner.innerHTML());
      }
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
    },
    render: function() {
      var startOfDay = this.props.selectedDay.startOf('day');
      var startOf
      var times = [startOfDay.clone()];
      var momentStrFormat = "Do, h:mm a";
      // TO-DO: add user chosen date
      for (i = 1; i < 48; i += 1) {
        times.push(startOfDay.add(30, "m").clone());
      }
      times.push(startOfDay.add(29, "m").clone());
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

      var startDuration = moment.duration(15, "m");
      var durations = [moment.duration(startDuration)];
      for (i = 1; i < 48; i += 1) {
        durations.push(moment.duration(startDuration.add(15, "m")));
      }
      var durationOptions = durations.map(function(durationObj) {
        return (
          <option value={durationObj.valueOf()}>{durationObj.humanize()}</option>
        );
      });
      var notMandatorySection = (
        <div className="not-mandatory-section">
          <div className="col-sm-6 after-time-container">
            <select ref="afterTime" value={times[0].valueOf()} className="generic-field-container">
              {afterTimeOptions}
            </select>
          </div>
          <div className="col-sm-6 before-time-container">
            <select ref="beforeTime" value={times[times.length - 1].valueOf()} className="generic-field-container">
              {beforeTimeOptions}
            </select>
          </div>
          <div className="col-sm-6 duration-container">
            <select ref="duration" className="generic-field-container">
              {durationOptions}
            </select>
          </div>
        </div>
      ); 
      var mandatorySection = (
        <div className="not-mandatory-section">
          <div className="col-sm-6 from-time-container">
            <select ref="fromTime" className="generic-field-container">
              {timeOptions}
            </select>
          </div>
          <div className="col-sm-6 to-time-container">
            <select ref="toTime" className="generic-field-container">
              {timeOptions}
            </select>
          </div>
          <div className="event-day-list" onClick={this.handleForWhichDays}>
            <div className="row">
              <li>Sun.</li>
              <li >Mon.</li>
              <li>Tue.</li>
              <li>Wed.</li>
              <li>Thu.</li>
              <li>Fri.</li>
              <li>Sat.</li>
            </div>
          </div>
        </div>
      );
      var timeRangeSection;
      var timeRangeSectionText;
      if (this.getCurrentEventInput().mandatory) {
        timeRangeSectionText = "Fixed Time Range"
        timeRangeSection = mandatorySection;
      } else {
        timeRangeSectionText = "Desired Time Constraints & Duration"
        timeRangeSection = notMandatorySection;
      }

      var mandButtonClass = "generic-field-container";
      var notMandButtonClass = "generic-field-container";
      if (this.getCurrentEventInput().mandatory) {
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
                  <input className="generic-field-container" type="text" ref="eventName" />
                </div>
                <div className="col-sm-6 category-select-container">
                  <select defaultValue="placeholder" ref="categorySelect" className="generic-field-container">
                    <option value="placeholder" disabled>Select a category</option>
                    {categoryOptions}
                  </select>
                </div>
              </div>
              <div>
                <div className="is-mandatory-text" onClick={this.toggleTimeInputMenus}> Mandatory Event </div>
                <div className="col-sm-6 mandatory-button">
                  <button className={mandButtonClass} type="button" onClick={this.isMandatory}>Yes</button>
                </div>
                <div className="col-sm-6 not-mandatory-button">
                  <button className={notMandButtonClass} type="button" onClick={this.isNotMandatory}>No</button>
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
                <input className="generic-field-container" type="text" ref="eventDescription" />
              </div>
            </div>
            <div>
              <button className="new-event-submit-button" type="button" onClick={this.handleAdd}>Add</button>
            </div>
          </form>
        </div>
      );
    }
  });
  return AddNewEventSection;
});