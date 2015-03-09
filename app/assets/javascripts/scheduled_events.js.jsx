var ScheduledEvents = React.createClass({
  render: function() {
    var timeFormat = "Do, h:mm a";
    events = this.props.data.map(function(e) {
      var fields; 
      if (e.mandatory) {
        fields = (
          <div className="mandatory-section">
            <div className="event-field inline-field-container inner-vert-ctr col-1-3"> {"title: " + e.title} </div>
            <div className="event-field inline-field-container inner-vert-ctr col-1-3"> {"from: " + e.start.format(timeFormat)} </div>
            <div className="event-field inline-field-container inner-vert-ctr col-1-3"> {"to: " + e.end.format(timeFormat)} </div>
          </div>
        );
      } else {
        fields = (
          <div className="mandatory-section">
            <div className="event-field inline-field-container inner-vert-ctr col-1-4"> {"title: " + e.title} </div>
            <div className="event-field inline-field-container inner-vert-ctr col-1-4"> {"duration: " + e.title} </div>
            <div className="event-field inline-field-container inner-vert-ctr col-1-4"> {"before: " + e.start.format(timeFormat)} </div>
            <div className="event-field inline-field-container inner-vert-ctr col-1-4"> {"after: " + e.end.format(timeFormat)} </div>
          </div>
        );
      }
      return (
        <div className="borderless-field-container grid col-1-1">
          {fields}
        </div>
      );
    });
    return (
      <div className="scheduled-events col-1-2">
        {events}
      </div>
    );
  }
});
