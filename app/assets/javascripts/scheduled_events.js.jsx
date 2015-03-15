var ScheduledEvents = React.createClass({
  render: function() {
    var timeFormat = "Do, h:mm a";
    var mandatoryEvents = [];
    var notMandatoryEvents = [];
    events = this.props.data.map(function(e) {
      var fields; 
      if (e.mandatory) {
        fields = (
          <div className="mandatory-section borderless-field-container">
            <div className="event-field inline-field-container inner-vert-ctr col-sm-3"> {e.title} </div>
            <div className="event-field inline-field-container inner-vert-ctr col-sm-3"> {e.start.format(timeFormat)} </div>
            <div className="event-field inline-field-container inner-vert-ctr col-sm-3"> {e.end.format(timeFormat)} </div>
            <div className="event-field inline-field-container inner-vert-ctr col-sm-3"> {e.location} </div>
          </div>
        );
        mandatoryEvents.push(fields);
      } else {
        fields = (
          <div className="not-mandatory-section borderless-field-container">
            <div className="event-field inline-field-container inner-vert-ctr col-sm-2"> {e.title} </div>
            <div className="event-field inline-field-container inner-vert-ctr col-sm-2"> {e.title} </div>
            <div className="event-field inline-field-container inner-vert-ctr col-sm-2"> {e.start.format(timeFormat)} </div>
            <div className="event-field inline-field-container inner-vert-ctr col-sm-2"> {e.end.format(timeFormat)} </div>
            <div className="event-field inline-field-container inner-vert-ctr col-sm-2"> {e.location} </div>
          </div>
        );
        notMandatoryEvents.push(fields);
      }
    });

    return (
      <div className="scheduled-events col-sm-6">
        <div className="mandatory-section borderless-field-container event-title">
          <div className="event-field inline-field-container inner-vert-ctr col-sm-3"><span>Title</span></div>
          <div className="event-field inline-field-container inner-vert-ctr col-sm-3"><span>From</span></div>
          <div className="event-field inline-field-container inner-vert-ctr col-sm-3"><span>To</span></div>
          <div className="event-field inline-field-container inner-vert-ctr col-sm-3"><span>Location</span></div>
        </div>
        {mandatoryEvents}
        <div className="not-mandatory-section borderless-field-container event-title">
          <div className="event-field inline-field-container inner-vert-ctr col-sm-15"><span>Title</span></div>
          <div className="event-field inline-field-container inner-vert-ctr col-sm-15"><span>Duration</span></div>
          <div className="event-field inline-field-container inner-vert-ctr col-sm-15"><span>Before</span></div>
          <div className="event-field inline-field-container inner-vert-ctr col-sm-15"><span>After</span></div>
          <div className="event-field inline-field-container inner-vert-ctr col-sm-15"><span>Location</span></div>
        </div>
        {notMandatoryEvents}
      </div>
    );
  }
});
