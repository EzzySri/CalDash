define(['react', 'constants', 'small_event_card'], function(React, Constants, SmallEventCard){
  
  var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

  var EventHistoryList = React.createClass({

    getInitialState: function() {
      return ({
        events: this.props.eventStoreState.events
      });
    },

    toggleList: function() {
      if (this.state.events.length == 0) {
        this.addToList();
      } else {
        this.removeAllFromList();
      }
    },

    getExamples: function() {
      var introEvent1 = {
        title: "Lunch with friends",
        category: "dining",
        mandatory: true,
        example: true,
        start: moment().startOf('day').add(12, "hours"),
        end: moment().startOf('day').add(13, "hours"),
        location: "Great China 2190 Bancroft Way, Berkeley, CA 94704",
        eventDescription: "Can't wait for Peking Duck : )"
      };
      var introEvent2 = {
        title: "Study for Midterm",
        category: "work",
        mandatory: false,
        example: true,
        before: moment().startOf('day').add(12, "hours"),
        after: moment().startOf('day').add(8, "hours"),
        location: "UC Doe Library, Berkeley, CA 94704",
        eventDescription: "No more procrastination!"
      };
      return [introEvent1, introEvent2];
    },

    addToList: function() {
      var events = this.state.events;
      if (this.props.eventStoreState.events.length == 0) {
        events = this.getExamples();
      } else {
        var l = this.props.eventStoreState.events.length;
        for (i = 0; i < l; i += 1) {
          events.push(this.props.eventStoreState.events[i]);
        }
      }  
      this.setState({events: events});
    },

    removeAllFromList: function() {
      var events = this.state.events;
      events.splice(0, events.length);
      this.setState({events: events});
    },

    componentDidMount: function() {
      var events;
      if (this.state.events.length == 0) {
        events = this.getExamples();
      }
      this.setState({events: events});
    },

    render : function() {

      var smallCardsList = this.state.events.map(function(event){
        return (
          <div key={this.state.events.indexOf(event)} className="history-event-card-container">
            <SmallEventCard eventSource={event} />
          </div>
        );
      }, this);

      return (
        <div className="event-history-list">
          <div id="expand-button" onClick={this.toggleList}>Top 10 most recent events</div>
          <ReactCSSTransitionGroup transitionName="event-history-list-expand">
            {smallCardsList}
          </ReactCSSTransitionGroup>
        </div>
      );
    }
  });
  return EventHistoryList;
});