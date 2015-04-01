var ScheduledEvents = React.createClass({
  showExtra: function(e) {
    temp = e.target.parentNode.parentNode.childNodes[0].className;
    temp = temp.substring(0, temp.length - 7);
    e.target.parentNode.parentNode.childNodes[1].className = temp;
  },
  render: function() {
    var timeFormat = "Do, h:mm a";
    var mandatoryEvents = [];
    var notMandatoryEvents = [];
    events = this.props.data.map(function(e) {
      var fields; 
      if (e.mandatory) {
        fields = (
          <tr>
            <th> {e.title} </th>
            <th> {e.start.format(timeFormat)} </th>
            <th> {e.end.format(timeFormat)} </th>
            <th> {e.location} </th>
          </tr>
        );
        mandatoryEvents.push(fields);
      } else {
        fields = (
          <tr>
            <th> {e.title} </th>
            <th> {e.start.format(timeFormat)} </th>
            <th> {e.end.format(timeFormat)} </th>
            <th> {e.location} </th>
          </tr>
        );
        notMandatoryEvents.push(fields);
      }
    });

    return (
      <div className="scheduled-events col-sm-6">
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
              <th>#</th>
              <th>Title</th>
              <th>From</th>
              <th>To</th>
              <th>Location</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {mandatoryEvents}
          </tbody>
        </table>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Duration</th>
              <th>Before</th>
              <th>After</th>
              <th>Location</th>
              <th>Description</th>
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
