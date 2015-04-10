define(['react', 'jquery', 'react_calendar'], function(React, $, ReactCalendar){
  var FullCalendar = React.createClass({
    dateForward: function() {
      this.props.onChangeDate(1);
    },
    dateBackward: function() {
      this.props.onChangeDate(-1);
    },
    render: function() {
      var tableHeadDateFormat = "LL"
      return (
        <div className="full-calendar">
          <div onClick={this.props.onToggleCalendar} className={this.props.moreCalendar ? "more-calendar-toggle more-calendar-toggle-inverted" : "more-calendar-toggle"}/>
          <div className="control-panel row show-grid">
            <div className="col-sm-2 col-0-gutter">
              <div className="control-button" onClick={this.dateBackward}> Previous </div>
            </div>
            <div className="col-sm-2 col-0-gutter">
              <div className="control-button" onClick={this.dateForward}> Next </div>
            </div>
            <div className="col-sm-6 control-panel-middle"> {this.props.selectedDay.format(tableHeadDateFormat)} </div>
            <div className="col-sm-2 col-0-gutter">
              <div className="control-button"> Month </div>
            </div>
          </div>
          <ReactCalendar events={this.props.events} selectedDay = {this.props.selectedDay} />
        </div>
      );
    }
  });
  return FullCalendar;
});