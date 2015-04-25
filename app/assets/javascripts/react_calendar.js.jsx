define(['react', 'jquery', 'moment', 'react_calendar_month', 'react_calendar_day'], function(React, $, moment, ReactCalendarMonth, ReactCalendarDay){
  var ReactCalendar = React.createClass({
    render: function() {
      var months;
      if (this.props.applicationStoreState.calendarMode == "month-mode") {
        months = new Array(12);
        for (i = 0; i < 12; i += 1) {
          months[i] = (
            <ReactCalendarMonth
              flux={this.props.flux}
              applicationStoreState={this.props.applicationStoreState}
              eventStoreState={this.props.eventStoreState}
              nthMonth={i} />);
        }
      }

      return (
        <div className="react-calendar">
          {
            this.props.applicationStoreState.calendarMode == "month-mode" ? (
              <div>{months}</div>
            ) : (
              <ReactCalendarDay
                tableStyle={this.props.tableStyle}
                applicationStoreState={this.props.applicationStoreState} 
                events={this.props.events} />
            )
          }
        </div>
      );
    }
  });
  return ReactCalendar;
});