define(['react', 'react_calendar_day'], function(React, ReactCalendarDay){
  var OptimizedSchedule = React.createClass({
    restartScheduling: function() {
      this.props.flux.actions.applicationActions.setStepCount(0);
    },
    handleConfirmSchedule: function() {
      this.props.flux.actions.eventActions.mergeResultsToCalendar();
      this.props.flux.actions.eventActions.syncScheduleChoice();
      this.props.flux.actions.applicationActions.setStepCount(2);
    },
    render: function() {
      var tableHeadDateFormat = "LL";
      var sectionHeight = this.props.stepExplanationCollapsed ? {height: "766px"} : {};
      return (
        <div className="optimized-schedule">
          {
            this.props.applicationStoreState.stepCount != 2 ? (
              <div className="control-panel row show-grid">
                <div className="col-sm-4 col-0-gutter">
                  <div className="control-button"> Previous Result</div>
                </div>
                <div className="col-sm-4 col-0-gutter">
                  <div className="control-button"> Next Result</div>
                </div>
                <div className="col-sm-4 col-0-gutter">
                  <div className="control-button" onClick={this.handleConfirmSchedule}> Confirm </div>
                </div>
              </div>
            ) : (
              <div className="control-panel row">
                <div className="col-sm-1"></div>
                <div className="col-sm-10">
                  <div id="restart-button" onClick={this.restartScheduling}> Start on a new day </div>
                </div>
                <div className="col-sm-1"></div>
              </div>
            )
          }
          <div className="optimized-schedule-main" style={sectionHeight}>
            <ReactCalendarDay
              tableStyle=" borderless succinct-inner"
              events={this.props.results}
              applicationStoreState={this.props.applicationStoreState} />
          </div>
        </div>
      );
    }
  });
  return OptimizedSchedule;
});