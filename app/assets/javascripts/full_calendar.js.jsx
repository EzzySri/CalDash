define(['react', 'jquery', 'react_calendar'], function(React, $, ReactCalendar){
  var FullCalendar = React.createClass({
    dateForward: function() {
      this.props.onChangeDate(1);
    },
    dateBackward: function() {
      this.props.onChangeDate(-1);
    },
    toggleCalendar: function() {
      if (this.props.applicationStoreState.moreCalendar) {
        this.props.flux.actions.applicationActions.calendarCollapse();
      } else {
        this.props.flux.actions.applicationActions.calendarExpand();
      }
    },
    render: function() {
      var tableHeadDateFormat = "LL"
      return (
        <div className="full-calendar">
          <div onClick={this.toggleCalendar} className={this.props.moreCalendar ? "more-calendar-toggle more-calendar-toggle-inverted" : "more-calendar-toggle"}/>
          <div className="control-panel row show-grid">
            <div className="col-sm-2 col-0-gutter">
              <div className="control-button" onClick={this.dateBackward}> Previous </div>
            </div>
            <div className="col-sm-2 col-0-gutter">
              <div className="control-button" onClick={this.dateForward}> Next </div>
            </div>
            <div className="col-sm-6 control-panel-middle"> {this.props.applicationStoreState.selectedDay.format(tableHeadDateFormat)} </div>
            <div className="col-sm-2 col-0-gutter">
              <div className="control-button"> Month </div>
            </div>
          </div>
          <ReactCalendar events={this.props.events} selectedDay = {this.props.applicationStoreState.selectedDay} />
        </div>
      );
    }
  });
  return FullCalendar;
});