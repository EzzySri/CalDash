define(['react', 'jquery', 'moment'], function(React, $, moment){
  var ReactCalendarMonth = React.createClass({
    componentDidMount: function() {
      var monthStartDate = moment().startOf("year").add(this.props.nthMonth, "month");
      var monthEndDate = moment(monthStartDate).endOf("month").startOf("day");
      this.props.flux.actions.eventActions.batchFetchEvents(monthStartDate.valueOf(), monthEndDate.valueOf());
    },
    selectDayView: function(event) {
      this.props.flux.actions.applicationActions.setSelectedDay(moment(parseInt(event.currentTarget.id)));
      this.props.flux.actions.applicationActions.setCalendarMode("day-mode");
    },
    render: function() {
      var nthMonth = this.props.nthMonth;
      var monthStartDate = moment().startOf("year").add(nthMonth, "month");
      var monthEndDate = moment(monthStartDate).endOf("month");
      var calendarStartDate = moment(monthStartDate).startOf("week");
      var calendarEndDate = moment(monthEndDate).endOf("week").startOf("day");
      var dates = [];
      var newWeek;
      while (calendarStartDate <= calendarEndDate) {
        if (calendarStartDate - moment(calendarStartDate).startOf("week") == 0) {
          newWeek = [];
        }
        newWeek.push(moment(calendarStartDate));
        if (calendarStartDate - moment(calendarStartDate).endOf("week").startOf("day") == 0) {
          dates.push(newWeek);
        }
        calendarStartDate.add(1, "day");
      }

      var tableContent = dates.map(function(week) {
          var datesInWeek = week.map(function(day) {
            var dateInUnix = moment(day).startOf("day").valueOf();
            var dotClass =  this.props.eventStoreState.allEvents[dateInUnix] && this.props.eventStoreState.allEvents[dateInUnix].length > 0 ? "dot hori-ctr" : "";
            return (
              <th className="data-row-data" id={dateInUnix} onClick={this.selectDayView}><div className="data-row-data-inner">{day.format("D")}<div className={dotClass}></div></div></th>
            );
          }, this);
          return (<tr className="data-row">{datesInWeek}</tr>);
        }, this);

      return (
        <div className="react-calendar-month">
          <div className="month-label">{monthStartDate.format("MMMM, YYYY")}</div>
          <table className={"table"}>
            {
              this.props.tableHeaderDisabled ? (
                <div></div>
              ) : (
                <thead>
                  <tr className="header-row">
                    <th className="header-row-data">Sun</th>
                    <th className="header-row-data">Mon</th>
                    <th className="header-row-data">Tue</th>
                    <th className="header-row-data">Wed</th>
                    <th className="header-row-data">Thu</th>
                    <th className="header-row-data">Fri</th>
                    <th className="header-row-data">Sat</th>
                  </tr>
                </thead>
              )
            }
            <tbody>{tableContent}</tbody>
          </table>
        </div>
      );
    }
  });
  return ReactCalendarMonth;
});