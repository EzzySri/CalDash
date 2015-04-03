define(['jquery', 'fluxxor', 'constants'], function($, Fluxxor, Constants){
  var EventStore = Fluxxor.createStore({
    initialize: function() {
      this.events = [];

      this.bindActions(
        Constants.ADD_EVENT, this.onAddEvent,
        Constants.REMOVE_EVENT, this.onRemoveEvent
      );
    },

    onAddEvent: function(payload) {
      // TO-DO: add unique id to store objects
      var clone = $.extend({}, payload.event);
      this.events.push(clone);
      this.emit("change");
    },

    onRemoveEvent: function(titleText) {
      // TO-DO: delete from id instead of names
      for (i = 0; i < this.events.length; i += 1) {
        e = this.events[i];
        if (e.title == titleText) {
          this.events.splice(i, 1);
          break
        }
      }
      this.emit("change");
    },

    getState: function() {
      return {
        events: this.events
      };
    }
  });
  return EventStore;
});