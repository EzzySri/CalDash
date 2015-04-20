define(['react', 'event_card', 'moment'], function(React, EventCard, moment){
  var ScheduledEvents = React.createClass({
    getInitialState: function() {
      var deleteButtonStatus = {};
      this.props.events.map(function(event){
        deleteButtonStatus[event.name] = false;
      }, this);
      return {
        deleteButtonStatus: deleteButtonStatus
      }
    },
    deleteCurrentEvent: function(e) {
      this.props.flux.actions.eventActions.removeEvent(e.currentTarget.parentNode.id);
    },
    handleMouseEnter: function(event) {
      var deleteButtonStatus = this.state.deleteButtonStatus;
      deleteButtonStatus[event.currentTarget.id] = true;
      this.setState({deleteButtonStatus: deleteButtonStatus});
    },
    handleMouseLeave: function(event) {
      var deleteButtonStatus = this.state.deleteButtonStatus;
      deleteButtonStatus[event.currentTarget.id] = false;
      this.setState({deleteButtonStatus: deleteButtonStatus});
    },
    render: function() {
      var context = this;
      var selectedDay = this.props.selectedDay;
      var eventSources = this.props.events;
      var events;
      if (eventSources.length == 0) {
        var introEvent1 = {
          name: "Lunch with friends",
          category: "dining",
          mandatory: true,
          example: true,
          start: moment().startOf('day').add(12, "hours"),
          end: moment().startOf('day').add(13, "hours"),
          location: "Great China 2190 Bancroft Way, Berkeley, CA 94704",
          eventDescription: "Can't wait for Peking Duck : )"
        };
        var introEvent2 = {
          name: "Study for Midterm",
          category: "work",
          mandatory: false,
          example: true,
          before: moment().startOf('day').add(12, "hours"),
          after: moment().startOf('day').add(8, "hours"),
          location: "UC Doe Library, Berkeley, CA 94704",
          eventDescription: "No more procrastination!"
        };
        events = [];
        events.push((<div className="row event-card-container"><EventCard eventSource={introEvent1}/></div>));
        events.push((<div className="row event-card-container"><EventCard eventSource={introEvent2}/></div>));
      } else {
        events = eventSources.map(function(e) {
          return (
            <div id={e.name} className="row event-card-container"
              onMouseEnter={this.handleMouseEnter}
              onMouseLeave={this.handleMouseLeave}>
              {
                this.state.deleteButtonStatus[e.name] ? (
                  <div className="delete-event-button" onClick={this.deleteCurrentEvent}>Delete</div>
                ) : (<div></div>)
              }
              <EventCard eventSource={e} />        
            </div>
          );
        }, this);
      }

      var sectionHeight = this.props.stepExplanationCollapsed ? {height: "852px"} : {};
      return (
        <div className="scheduled-events" style={sectionHeight}>
          <div className="row">
            <div className="col-sm-1"></div>
            <div className="col-sm-10">
              <div id="optimize-button" onClick={this.props.flux.actions.eventActions.getOptimizedSchedules}> Optimize Schedule </div>
            </div>
            <div className="col-sm-1"></div>
          </div>
          <div className="event-cards-list">
          {events}
          </div>
        </div>
      );
    }
  });
  return ScheduledEvents;
});