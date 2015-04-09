define(['react', 'react_calendar'], function(React, ReactCalendar){
  var OptimizedSchedule = React.createClass({
    getInitialState: function() {
      return {
      };
    },
    render: function() {
      var tableHeadDateFormat = "LL";
      return (
        <div className="optimized-schedule">
          <div className="control-panel row show-grid">
            <div className="col-sm-1 col-0-gutter">
              <div className="control-button"> Previous </div>
            </div>
            <div className="col-sm-1 col-0-gutter">
              <div className="control-button"> Next </div>
            </div>
            <div className="col-sm-9 control-panel-middle"> {this.props.selectedDay.format(tableHeadDateFormat)} </div>
            <div className="col-sm-1 col-0-gutter">
              <div className="control-button" onClick={this.props.onConfirmSchedule}> Confirm </div>
            </div>
          </div>
          <ReactCalendar
            events={this.props.results}
            selectedDay = {this.props.selectedDay} />
        </div>
      );
    }
  });
  return OptimizedSchedule;
});