define(['react', 'jquery', 'fullcalendar'], function(React, $, _){
  var FullCalendar = React.createClass({
    componentDidMount: function() {
      var context = this;
      var calendar = $("#full-calendar").fullCalendar({
        header: {
          left: 'prev,next today',
          center: 'title',
          right: 'month, agendaWeek, agendaDay'
        },
        defaultView: 'agendaDay',
        aspectRatio: 1,
        dayClick: function(date, jsEvent, view) {
            calendar.fullCalendar('changeView', "agendaDay");
            context.props.onChangeDayView(date);
        }
      });
    },
    render: function() {
      return (
        <div id="full-calendar" className="calendar"></div>
      );
    }
  });
  return FullCalendar;
});

