define(['jquery', 'fluxxor', 'constants', 'moment'], function($, Fluxxor, Constants, moment){
  var EventStore = Fluxxor.createStore({
    initialize: function() {
      this.events = [];
      // stored temporarily; cleared after user confirmation his choice
      this.optimizedResults = [];

      this.currentEventInput = {
        location: "",
        mandatory: false,
        title: "",
        category: "",
        start: null,
        end: null,
        after: null,
        before: null,
        description: ""
      },

      this.bindActions(
        Constants.ADD_EVENT, this.onAddEvent,
        Constants.REMOVE_EVENT, this.onRemoveEvent,
        Constants.GET_OPTIMIZED_SCHEDULES, this.onGetOptimizedSchedules,
        Constants.CLEAR_OPTIMIZED_RESULTS, this.onClearOptimizedResults,
        Constants.MERGE_RESULTS_TO_CALENDAR, this.onMergeResultsToCalendar,
        Constants.ActionTypes.SET_LOCATION, this.onSetLocation,
        Constants.ActionTypes.SET_MANDATORY, this.onSetMandatory
      );
    },

    onSetLocation: function(payload) {
      this.currentEventInput.location = payload.location;
      this.emit("change");
    },

    onSetMandatory: function(payload) {
      this.currentEventInput.mandatory = payload.mandatory;
      this.emit("change");
    },

    mergeWithCurrentEvent: function(partialEventSource) {

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

    onGetOptimizedSchedules: function(date) {
      var json = this.events.map(function(item){
        var clone = $.extend({}, item);
        if (item.mandatory) {
          clone.start = clone.start.toJSON();
          clone.end = clone.end.toJSON();
        } else {
          clone.before = clone.before.toJSON();
          clone.after = clone.after.toJSON();
          clone.duration = clone.duration.toJSON();
        }
        return clone;
      });
      $.ajax({
        url: Constants.APIEndpoints.OPTIMIZE,
        method: "POST",
        dataType: "json",
        data: {
          events: json
        }, 
        success: function(data) {
          results = data.events;
          var start = 0;
          while (results[start]) {
            item = results[start]
            item.start = moment(item.start);
            item.end = moment(item.end);
            this.optimizedResults.push(item);
            start += 1;
          }
          this.emit(Constants.GET_OPTIMIZED_SCHEDULES_EVENT, Constants.SUCCESS);
        }.bind(this),
        error: function(xhr, status, err) {

        }.bind(this)
      });
      this.emit("change");
    },

    // assume optimzedResults are not yet cleared
    onMergeResultsToCalendar: function() {
      var events = this.events;
      this.optimizedResults.forEach(function(item) {
        if (!(events.some(function(original){
          return original.mandatory && (original.start - item.start == 0);}))) {
          events.push(item);
        }
      });
      this.events.filter(function(item){
        return !item.mandatory;
      });
      this.emit("change");
    },

    onClearOptimizedResults: function() {
      this.optimizedResults.splice(0, this.optimizedResults.length);
      this.emit("change");
    },

    getMandatoryEvents: function() {
      return this.events.filter(function(item){
        return item.mandatory;
      }).sort(function(a, b){
        return a.start.valueOf() - b.start.valueOf();
      });
    },

    getState: function() {
      return {
        optimizedResults: this.optimizedResults,
        events: this.events,
        currentEventInput: this.currentEventInput
      };
    }
  });
  return EventStore;
});