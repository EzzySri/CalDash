define(['react', 'jquery'], function(React, $){
  var ReactCalendar = React.createClass({
    getInitialState: function() {
      var green = "#1abc9c";
      var blue = "#3498db";
      var darkRed = "#eb843d";
      var colors = [blue, darkRed, green];
      return {
        colors: colors,
      };
    },
    // FIXTURES for testing purposes only
    getEvents: function() {
      return [
        {
          start: moment().startOf('day'),
          end: moment().startOf('day').add(2, 'hours'),
          title: "Test Event 1"
        },
        {
          start: moment().startOf('day').add(3, 'hours'),
          end: moment().startOf('day').add(4.5, 'hours'),
          title: "Test Event 2"
        }
      ];
    },
    render: function() {
      var selectedDay = this.props.selectedDay;

      var startOfDay = this.props.selectedDay.startOf('day');
      var times = [startOfDay.clone(), startOfDay.clone()];
      var momentStrFormat = "ha";

      var events = this.props.events;

      for (i = 1; i < 24; i += 1) {
        times.push(startOfDay.add(1, "h").clone());
        times.push(startOfDay.clone());
      }
      var atIndex = 0;
      // TO-DO: make this dynamic
      // TO-DO: does not yet support duration shorter than 0.5 hours; both need to sqeeuze
      // into one row
      var rowHeight = 35;
      var context = this;
      var prevColorIndex = 0;
      var timeOptions = times.map(function(momentObj, index) {
        var dataContent = [];
        for (i = atIndex; i < events.length; i += 1) {
          var start = events[i].start;
          var end = events[i].end;
          var title = events[i].title;
          if ((start - momentObj) < moment.duration({"hours": 0.5})) {
            atIndex += 1;
            beginGap = start - momentObj;
            startDist = rowHeight * beginGap.valueOf() / moment.duration({'hours': 0.5}).valueOf();
            durationDist = rowHeight * (end.valueOf() - start.valueOf()) / moment.duration({'hours': 0.5}).valueOf() - 4;
            var style = {
              top: startDist + "px",
              height: durationDist + "px",
              backgroundColor: context.state.colors[prevColorIndex]
            }
            prevColorIndex = (prevColorIndex + 1) % 3;
            dataContent.push(
              <div className="data-row-data-inner" style={style}>
                <div className="event-time-text">{start.format(momentStrFormat)}</div>
                <div className="event-title-text">{title}</div>
              </div>
            );
          }
        }
        if (index % 2 == 0) {
          return (
            <tr className="data-row">
              <th className="data-row-header">{momentObj.format(momentStrFormat)}</th>
              <th className="data-row-data">{dataContent}</th>
            </tr>
          );
        } else {
          return (
            <tr className="data-row data-row-minor">
              <th className="data-row-header"></th>
              <th className="data-row-data">{dataContent}</th>
            </tr>
          );
        }
      });

      return (
        <div className="react-calendar">
          <table className="table table-bordered">
            <thead>
              <tr className="header-row">
                <th className="header-row-header"></th>
                <th className="header-row-data">{selectedDay.format('dddd')}</th>
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
  return ReactCalendar;
});