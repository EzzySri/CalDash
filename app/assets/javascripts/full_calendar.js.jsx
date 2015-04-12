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
    setCalendarMode: function() {
      if (this.props.applicationStoreState.calendarMode == "day-mode") {
        this.props.flux.actions.applicationActions.setCalendarMode("month-mode");
      } else {
        this.props.flux.actions.applicationActions.setCalendarMode("day-mode");
      }
    },
    render: function() {
      var tableHeadDateFormat = "LL"
      return (
        <div className="full-calendar">
          <div onClick={this.toggleCalendar} className={this.props.applicationStoreState.moreCalendar ? "more-calendar-toggle more-calendar-toggle-inverted" : "more-calendar-toggle"}/>
          <div className="control-panel row show-grid">
            <div className="col-sm-2 col-0-gutter">
              <div className="control-button" onClick={this.dateBackward}> Previous </div>
            </div>
            <div className="col-sm-2 col-0-gutter">
              <div className="control-button" onClick={this.dateForward}> Next </div>
            </div>
            <div className="col-sm-6 control-panel-middle"> {this.props.applicationStoreState.selectedDay.format(tableHeadDateFormat)} </div>
            <div className="col-sm-2 col-0-gutter">
              {
                this.props.applicationStoreState.calendarMode == "day-mode" ? (
                  <div className="control-button" onClick={this.setCalendarMode}> Month </div>
                ) : (
                  <div className="control-button" onClick={this.setCalendarMode}> Day </div>
                )
              }
            </div>
          </div>
          <div className="full-calendar-main">
            <ReactCalendar tableStyle=" table-bordered" events={this.props.events} applicationStoreState={this.props.applicationStoreState} />
          </div>
        </div>
      );
    }
  });
  return FullCalendar;
});