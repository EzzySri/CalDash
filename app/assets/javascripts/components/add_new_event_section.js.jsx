var AddNewEventSection = React.createClass({
  getInitialState: function() {
    return {
      mandatory: false,
      duration: null,
      forWhichDays: new Set(),
      location: ""
    };
  },
  handleAdd: function() {
    var eventSource, momentFrom, momentTo, momentBefore, momentAfter;
    var title = this.refs.eventName.getDOMNode().value.trim(); 
    if (this.state.mandatory) {
      momentFrom = moment(parseInt(this.refs.fromTime.getDOMNode().value));
      momentTo = moment(parseInt(this.refs.toTime.getDOMNode().value));
      eventSource = {
        title: title,
        start: momentFrom, 
        end: momentTo,
        location: this.state.location
      }
      $("#full-calendar").fullCalendar('renderEvent', eventSource, true); 
    } else {
      momentBefore = moment(parseInt(this.refs.beforeTime.getDOMNode().value));
      momentAfter = moment(parseInt(this.refs.afterTime.getDOMNode().value));
      eventSource = {
        title: title,
        duration: moment.duration(parseInt(this.refs.duration.getDOMNode().value)),
        start: momentBefore, 
        end: momentAfter
      }
    }
    eventSource["mandatory"] = this.state.mandatory;
    this.props.onAddEvent(eventSource);
    if (this.state.location) {
      this.props.onLocationSelected(this.state.location);
    }
  },
  isMandatory: function() {
    if (!this.state.mandatory) {
      this.setState({mandatory: true});
    }
  },
  isNotMandatory: function() {
    if (this.state.mandatory) {
      this.setState({mandatory: false});  
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
    this.props.onLocationInputChange(
      this.refs.locationInput.getDOMNode().value
    );
  },
  handleLocationChoice: function(event) {
    var loc = event.target.innerHTML;
    this.setState({location: loc});
    this.refs.locationInput.getDOMNode().value = loc;
    // this.refs.predictionList.getDOMNode().innerHTML = "";
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
    var timeOptions = times.map(function(momentObj) {
      return (
        <option value={momentObj.valueOf()}>{momentObj.format(momentStrFormat)}</option>
      );
    });

    var startDuration = moment.duration(15, "m");
    var durations = [moment.duration(startDuration)];
    var durationStrFormat = "h [hrs], m [min]";
    for (i = 1; i < 48; i += 1) {
      durations.push(moment.duration(startDuration.add(15, "m")));
    }
    var durationOptions = durations.map(function(durationObj) {
      return (
        <option value={durationObj.valueOf()}>{durationObj.format(durationStrFormat)}</option>
      );
    });
    var notMandatorySection = (
      <div className="not-mandatory-section">
        <div className="borderless-field-container col-sm-12">
          <div className="duration-text col-sm-4 vert-ctr">For how long?</div>
          <div className="duration-container col-sm-8">
            <select ref="duration" className="event-duration-select">
              {durationOptions}
            </select>
          </div>
        </div>
        <div className="borderless-field-container col-sm-12">
          <div className="before-filter-text col-sm-3 vert-ctr">Before:</div>
          <select ref="beforeTime" className="before-filter-select col-sm-3">
            {timeOptions}
          </select>
          <div className="after-filter-text col-sm-3 vert-ctr">After:</div>
          <select ref="afterTime" className="after-filter-select col-sm-3">
            {timeOptions}
          </select>
        </div>
      </div>
    ); 
    var mandatorySection = (
      <div className="not-mandatory-section">
        <div className="borderless-field-container col-sm-12">
          <div className="from-time-text col-sm-3 vert-ctr"> From: </div>
          <select ref="fromTime" className="from-time-select col-sm-3">
            {timeOptions}
          </select>
          <div className="to-time-text col-sm-3 vert-ctr">To:</div>
          <select ref="toTime" className="to-time-select col-sm-3">
            {timeOptions}
          </select>
        </div>
        <div className="borderless-field-container col-sm-12">
          <div className="event-day-list">
            <ul onClick={this.handleForWhichDays} className="day-container">
              <li>Sun.</li>
              <li >Mon.</li>
              <li>Tue.</li>
              <li>Wed.</li>
              <li>Thu.</li>
              <li>Fri.</li>
              <li>Sat.</li>
            </ul>
          </div>
        </div>
      </div>
    );
    var timeRangeSection;
    if (this.state.mandatory) {
      timeRangeSection = mandatorySection;
    } else {
      timeRangeSection = notMandatorySection;
    }

    var newPreds = this.props.newPredictions.map(function(pred) {
      return (
        <li className="prediction-text">{pred.description}</li>
      );
    });

    return (
      <div className="add-new-event-container col-sm-6">
        <form onSubmit={this.handleSubmit}>
          <div>
            <input className="generic-field-container" type="text" placeholder="Event Name" ref="eventName" />
          </div>
          <div>
            <input className="generic-field-container" type="text" placeholder="Location" ref="locationInput" onChange={this.handleLocationInputChange} />
          </div>
          <ul ref="predictionList" onClick={this.handleLocationChoice} className="prediction-list no-list-style">
            {newPreds}
          </ul>
          <div className="borderless-field-container col-sm-12">
            <div className="is-mandatory-text col-sm-4 vert-ctr" onClick={this.toggleTimeInputMenus}>Mandatory Event?</div>
            <button className="col-sm-4 inline-field-container vert-ctr merge-right-border" type="button" onClick={this.isMandatory}>Yes</button>
            <button className="col-sm-4 inline-field-container vert-ctr" type="button" onClick={this.isNotMandatory}>No</button>
          </div>
          {timeRangeSection}
          <div>
            <button className="generic-field-container" type="button" onClick={this.handleAdd}>Add</button>
          </div>
        </form>
      </div>
    );
  }
});


