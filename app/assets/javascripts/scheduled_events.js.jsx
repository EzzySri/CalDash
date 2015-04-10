define(['react', 'event_card'], function(React, EventCard){
  var ScheduledEvents = React.createClass({
    deleteCurrentEvent: function(e) {
      titleNode = e.target.parentNode.parentNode.children[0];
      titleText = titleNode.innerText;
      this.props.onDeleteEvent(titleText);
    },
    render: function() {
      var context = this;
      var selectedDay = this.props.selectedDay;
      var eventSources = this.props.events;
      var events;
      if (eventSources.length == 0) {
        var introEvent1 = {
          title: "Lunch with friends",
          category: "dining",
          mandatory: true,
          example: true,
          start: moment().startOf('day').add(12, "hours"),
          end: moment().startOf('day').add(13, "hours"),
          location: "Great China 2190 Bancroft Way, Berkeley, CA 94704",
          description: "Can't wait for Peking Duck : )"
        };
        var introEvent2 = {
          title: "Study for Midterm",
          category: "work",
          mandatory: false,
          example: true,
          before: moment().startOf('day').add(12, "hours"),
          after: moment().startOf('day').add(8, "hours"),
          location: "UC Doe Library, Berkeley, CA 94704",
          description: "No more procrastination!"
        };
        events = [];
        events.push((<div className="row event-card-container"><EventCard eventSource={introEvent1}/></div>));
        events.push((<div className="row event-card-container"><EventCard eventSource={introEvent2}/></div>));
      } else {
        events = eventSources.map(function(e) {
          return (
            <div className="row event-card-container">
              <EventCard eventSource={e} />        
            </div>
          );
        });
      }

      var sectionHeight = this.props.stepExplanationCollapsed ? {height: "865px"} : {};
      return (
        <div className="scheduled-events" style={sectionHeight}>
          <div className="row">
            <div className="col-sm-1"></div>
            <div className="col-sm-10">
              <div id="optimize-button" onClick={this.props.onGetOptimizedSchedules}> Optimize Schedule </div>
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