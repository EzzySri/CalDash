var ScheduledEvents = React.createClass({
  render: function() {
    var timeFormat = "Do, h:mm a";
    events = this.props.data.map(function(e) {
      var fields; 
      if (e.mandatory) {
        fields = (
          <div className="mandatory-section">
            <div className="event-field inline-field-container inner-vert-ctr col-sm-4"> {"title: " + e.title} </div>
            <div className="event-field inline-field-container inner-vert-ctr col-sm-4"> {"from: " + e.start.format(timeFormat)} </div>
            <div className="event-field inline-field-container inner-vert-ctr col-sm-4"> {"to: " + e.end.format(timeFormat)} </div>
          </div>
        );
      } else {
        fields = (
          <div className="mandatory-section">
            <div className="event-field inner-vert-ctr col-sm-3"> {"title: " + e.title} </div>
            <div className="event-field inner-vert-ctr col-sm-3"> {"duration: " + e.title} </div>
            <div className="event-field inner-vert-ctr col-sm-3"> {"before: " + e.start.format(timeFormat)} </div>
            <div className="event-field inner-vert-ctr col-sm-3"> {"after: " + e.end.format(timeFormat)} </div>
          </div>
        );
      }
      return fields
    });

    return (
      <div className="scheduled-events col-sm-6">
        {events}
      </div>
    );
  }
});
