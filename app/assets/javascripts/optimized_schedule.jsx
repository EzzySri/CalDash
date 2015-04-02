var OptimizedSchedule = React.createClass({
  getInitialState: function() {
    return {
    };
  },
  render: function() {
    var selectedDay = this.props.selectedDay;

    var startOfDay = this.props.selectedDay.startOf('day');
    var times = [startOfDay.clone()];
    var momentStrFormat = "ha";
    var tableHeadDateFormat = "LL"

    for (i = 1; i < 24; i += 1) {
      times.push(startOfDay.add(1, "h").clone());
      times.push(startOfDay.clone());
    }
    var timeOptions = times.map(function(momentObj, index) {
      if (index % 2 == 0) {
        return (
          <tr className="table-data-row">
            <th className="y-axis">{momentObj.format(momentStrFormat)}</th>
            <th className="table-event-cell"></th>
          </tr>
        );
      } else {
        return (
          <tr className="table-data-row data-row-minor">
            <th className="y-axis"></th>
            <th className="table-event-cell"></th>
          </tr>
        );
      }
    });

    return (
      <div className="optimized-schedule">
        <div className="control-panel row show-grid">
          <div className="col-sm-1 col-0-gutter">
            <div className="control-button"> Back </div>
          </div>
          <div className="col-sm-1 col-0-gutter">
            <div className="control-button"> Next </div>
          </div>
          <div className="col-sm-9 control-panel-middle"> {selectedDay.format(tableHeadDateFormat)} </div>
          <div className="col-sm-1 col-0-gutter">
            <div className="control-button"> Confirm </div>
          </div>
        </div>
        <table className="table table-bordered">
          <thead>
            <tr id="top-row">
              <th className="y-axis"></th>
              <th id="r-0-c-1">{selectedDay.format('dddd')}</th>
            </tr>
          </thead>
          <tbody>
            {timeOptions}
          </tbody>
        </table>
      </div>
    );
  }
});
