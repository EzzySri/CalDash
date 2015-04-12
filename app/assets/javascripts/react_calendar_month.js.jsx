define(['react', 'jquery', 'moment'], function(React, $, moment){
  var ReactCalendarMonth = React.createClass({
    getInitialState: function() {
      return {
      };
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
            return (
              <th className="data-row-data"><div className="data-row-data-inner">{day.format("D")}<div className="dot hori-ctr"></div></div></th>
            );
          });
          return (<tr className="data-row">{datesInWeek}</tr>);
        });

      return (
        <div className="react-calendar-month">
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