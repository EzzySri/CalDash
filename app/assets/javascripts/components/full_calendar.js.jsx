var FullCalendar = React.createClass({
  componentDidMount: function() {
    var context = this;
    var calendar = $("#full-calendar").fullCalendar({
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month, agendaWeek, agendaDay'
      },
      dayClick: function(date, jsEvent, view) {
          calendar.fullCalendar('changeView', "agendaDay");
          context.props.onChangeDayView(date);
          $("#full-calendar").removeClass("col-1-1");
          $("#full-calendar").addClass("col-1-2");
      },
      viewRender: function(view, element) {
        if (view.name == "agendaWeek" || view.name == "month") {
          $("#full-calendar").removeClass("col-1-2");
          $("#full-calendar").addClass("col-1-1");  
        }
      }
    });
  },
  render: function() {
    return (
      <div id="full-calendar" className="col-1-1"></div>
    );
  }
});
