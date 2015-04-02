define(['react'], function(React){
  var ScheduledEvents = React.createClass({
    deleteCurrentEvent: function(e) {
      titleNode = e.target.parentNode.parentNode.children[0];
      titleText = titleNode.innerText;
      this.props.onDeleteEvent(titleText);
    },
    render: function() {
      var timeFormat = "Do, h:mm a";
      var mandatoryEvents = [];
      var notMandatoryEvents = [];
      var context = this;
      events = this.props.data.map(function(e) {
        var fields; 
        if (e.mandatory) {
          fields = (
            <tr>
              <th> {e.title} </th>
              <th> {e.start.format(timeFormat)} </th>
              <th> {e.end.format(timeFormat)} </th>
              <th> {e.location} </th>
              <th> {e.eventDescription} </th>
              <th className="hori-ctr" onClick={context.deleteCurrentEvent}><div id="delete-event-button">Remove</div></th>
            </tr>
          );
          mandatoryEvents.push(fields);
        } else {
          fields = (
            <tr>
              <th> {e.title} </th>
              <th> {e.duration.humanize()} </th>
              <th> {e.before.format(timeFormat)} </th>
              <th> {e.after.format(timeFormat)} </th>
              <th> {e.location} </th>
              <th> {e.eventDescription} </th>
              <th className="hori-ctr" onClick={context.deleteCurrentEvent}><div id="delete-event-button">Remove</div></th>
            </tr>
          );
          notMandatoryEvents.push(fields);
        }
      });

      return (
        <div className="scheduled-events">
          <div className="row">
            <div className="col-sm-4"></div>
            <div className="col-sm-4">
              <div id="optimize-button"> Get Optimal Schedule </div>
            </div>
            <div className="col-sm-4"></div>
          </div>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Title</th>
                <th>From</th>
                <th>To</th>
                <th>Location</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mandatoryEvents}
            </tbody>
          </table>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Title</th>
                <th>Duration</th>
                <th>Before</th>
                <th>After</th>
                <th>Location</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {notMandatoryEvents}
            </tbody>
          </table>
        </div>
      );
    }
  });
  return ScheduledEvents;
});