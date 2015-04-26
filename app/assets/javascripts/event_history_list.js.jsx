define(['utils', 'react', 'constants', 'small_event_card', 'event_card'], function(Utils, React, Constants, SmallEventCard, EventCard){
  
  var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

  var EventHistoryList = React.createClass({

    getInitialState: function() {
      return ({
        events: this.props.eventStoreState.recentEvents,
        eventCardOnDisplay: []
      });
    },

    toggleList: function() {
      if (this.state.events.length == 0) {
        this.addToList();
      } else {
        this.removeAllFromList();
      }
    },

    addToList: function() {
      var events = this.state.events;
      var l = this.props.eventStoreState.recentEvents.length;
      for (i = 0; i < l; i += 1) {
        events.push(this.props.eventStoreState.recentEvents[i]);
      }
      this.setState({events: events});
    },

    removeAllFromList: function() {
      var events = this.state.events;
      events.splice(0, events.length);
      this.setState({events: events});
    },

    handleMouseOver: function(event) {
      var e = this.state.eventCardOnDisplay;
      var targetName = event.currentTarget.id;
      var targetEvent = Utils.customIndexOf(this.state.events, function(item){
        return item.name == targetName;
      });
      e.push(targetEvent);
      this.setState({eventCardOnDisplay: e});
    },

    handleMouseOut: function() {
      var e = this.state.eventCardOnDisplay;
      e.splice(0, e.length);
      this.setState({eventCardOnDisplay: e});
    },

    componentDidMount: function() {
      this.props.flux.actions.eventActions.fetchRecentEvents();
    },

    render : function() {

      var smallCardsList = this.state.events.map(function(event){
        return (
          <div id={event.name} key={this.state.events.indexOf(event)} onMouseOver={this.handleMouseOver} onMouseOut={this.handleMouseOut} className="history-event-card-container">
            <SmallEventCard eventSource={event} />
          </div>
        );
      }, this);

      var bigEventCard = [];
      if (this.state.eventCardOnDisplay.length != 0) {
        bigEventCard = (<div className="event-card-outer-container"><EventCard eventSource={this.state.eventCardOnDisplay[0]} /></div>);
      }

      return (
        <div>
          <div className="event-history-list">
            <div id="expand-button" onClick={this.toggleList}>Top 10 most recent events</div>
            <ReactCSSTransitionGroup transitionName="event-history-list-expand">
              {smallCardsList}
            </ReactCSSTransitionGroup>
          </div>
          <div className="event-card-on-display">
            {bigEventCard}
          </div>
        </div>
      );
    }
  });
  return EventHistoryList;
});