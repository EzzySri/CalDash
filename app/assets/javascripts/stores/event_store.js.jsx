define(['fluxxor', 'constants'], function(Fluxxor, Constants){
  var EventStore = Fluxxor.createStore({
    initialize: function() {
      this.events = [];

      this.bindActions(
        Constants.ADD_EVENT, this.onAddEvent,
        Constants.REMOVE_EVENT, this.onRemoveEvent
      );
    },

    onAddEvent: function(payload) {
      // TO-DO here; configure the hash
      this.events.push({text: payload.text, complete: false});
      this.emit("change");
    },

    onRemoveEvent: function(payload) {
      // TO-DO
      
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