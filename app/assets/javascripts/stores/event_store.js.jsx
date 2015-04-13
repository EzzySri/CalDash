define(['jquery', 'fluxxor', 'constants', 'moment', 'adapters'], function($, Fluxxor, Constants, moment, Adapters){
  var EventStore = Fluxxor.createStore({
    initialize: function() {
      this.allEvents = {};
      // stored temporarily; cleared after user confirms his choice
      this.optimizedResults = [];

      this.currentEventInput = {
        location: "",
        mandatory: false,
        title: "",
        category: "placeholder",
        start: null,
        end: null,
        after: null,
        before: null,
        eventDescription: "",
        lat: null,
        lng: null
      },

      this.bindActions(
        Constants.ADD_EVENT, this.onAddEvent,
        Constants.REMOVE_EVENT, this.onRemoveEvent,
        Constants.GET_OPTIMIZED_SCHEDULES, this.onGetOptimizedSchedules,
        Constants.CLEAR_OPTIMIZED_RESULTS, this.onClearOptimizedResults,
        Constants.MERGE_RESULTS_TO_CALENDAR, this.onMergeResultsToCalendar,
        Constants.ActionTypes.SET_LOCATION, this.onSetLocation,
        Constants.ActionTypes.SET_MANDATORY, this.onSetMandatory,
        Constants.ActionTypes.SET_TITLE, this.onSetTitle,
        Constants.ActionTypes.SET_CATEGORY, this.onSetCategory,
        Constants.ActionTypes.SET_AFTER_TIME, this.onSetAfterTime,
        Constants.ActionTypes.SET_BEFORE_TIME, this.onSetBeforeTime,
        Constants.ActionTypes.SET_START_TIME, this.onSetStartTime,
        Constants.ActionTypes.SET_END_TIME, this.onSetEndTime,
        Constants.ActionTypes.SET_DURATION, this.onSetDuration,
        Constants.ActionTypes.SET_EVENT_DESCRIPTION, this.onSetEventDescription,
        Constants.ActionTypes.SYNC_SCHEDULE_CHOICE, this.onSyncScheduleChoice
      );
    },

    setDependentValues: function() {
      var timeOptions = this.flux.store("EventFormStore").getState().timeOptions;
      var changed = false;
      if (this.currentEventInput.after == null) {
        changed = true;
        this.currentEventInput.after = this.flux.store("EventFormStore").timeOptions[0];
      }
      if (this.currentEventInput.before == null) {
        changed = true;
        this.currentEventInput.before = this.flux.store("EventFormStore").timeOptions[timeOptions.length - 1];
      }
      if (this.currentEventInput.duration == null) {
        changed = true;
        this.currentEventInput.duration = this.flux.store("EventFormStore").durationOptions[0];
      }
      if (this.currentEventInput.start == null) {
        changed = true;
        this.currentEventInput.start = this.flux.store("EventFormStore").timeOptions[0];
      }
      if (this.currentEventInput.end == null) {
        changed = true;
        this.currentEventInput.end = this.flux.store("EventFormStore").timeOptions[0];
      }
      if (changed) {
        this.emit("change");
      }
    },

    onSetLocation: function(payload) {
      this.currentEventInput.location = payload.location;
      this.emit("change");
    },

    onSetAfterTime: function(payload) {
      this.currentEventInput.after = moment(payload.after);
      this.emit("change");
    },

    onSetBeforeTime: function(payload) {
      this.currentEventInput.before = moment(payload.before);
      this.emit("change");
    },

    onSetStartTime: function(payload) {
      this.currentEventInput.start = moment(payload.start);
      this.emit("change");
    },

    onSetEndTime: function(payload) {
      this.currentEventInput.end = moment(payload.end);
      this.emit("change");
    },

    onSetDuration: function(payload) {
      this.currentEventInput.duration = moment.duration(payload.duration);
      this.emit("change");
    },    

    onSetTitle: function(payload) {
      this.currentEventInput.title = payload.title;
      this.emit("change");
    },

    onSetEventDescription: function(payload) {
      this.currentEventInput.eventDescription = payload.eventDescription;
      this.emit("change");
    },

    onSetCategory: function(payload) {
      this.currentEventInput.category = payload.category;
      this.emit("change");
    },

    onSetMandatory: function(payload) {
      this.currentEventInput.mandatory = payload.mandatory;
      this.emit("change");
    },

    getEvents: function() {
      var selectedDayUnix = this.flux.store("ApplicationStore").getState().selectedDay.valueOf();
      if (!(selectedDayUnix in this.allEvents)) {
        this.allEvents[selectedDayUnix] = []; 
      }
      return this.allEvents[selectedDayUnix];
    },

    onSyncScheduleChoice: function () {
      var eventAssignments = this.optimizedResults.map(function(item){
        return Adapters.eventAssignmentAdapter(item);
      });
      $.ajax({
        url: Constants.APIEndpoints.EVENT_ASSIGNMENTS_BATCH_CREATE,
        method: "POST",
        dataType: "json",
        data: {
          event_assignments: eventAssignments
        }, 
        success: function(data) {
          this.onClearOptimizedResults();
        }.bind(this),
        error: function(xhr, status, err) {
          // TO-DO
        }.bind(this)
      });
      this.emit("change");
    },

    onAddEvent: function() {
      // TO-DO: add unique id to store objects
      var clone = {};
      var title = this.currentEventInput.title;
      var category = this.currentEventInput.category;
      if (!(title && category != "placeholder")) {
        this.flux.store("FlashMessageStore").onDisplayFlashMessage({flashMessage: "Event Name and Category should not be empty.", flashMessageType: "error", random: Math.random()});
        return;
      }
      clone["location"] = this.currentEventInput.location;
      clone["category"] = category;
      clone["mandatory"] = this.currentEventInput.mandatory;
      clone["title"] = title;
      clone["duration"] = this.currentEventInput.duration;
      clone["eventDescription"] = this.currentEventInput.eventDescription;
      clone["lat"] = this.currentEventInput.lat;
      clone["lng"] = this.currentEventInput.lng;
      if (!this.currentEventInput.mandatory) {
        momentBefore = this.currentEventInput.before;
        momentAfter = this.currentEventInput.after;
        if (momentBefore <= momentAfter) {
          this.flux.store("FlashMessageStore").onDisplayFlashMessage({flashMessage: "Before Estimate should not be less than or equal to After Estimate.", flashMessageType: "error", random: Math.random()});
          return;   
        }
        clone["before"] = momentBefore;
        clone["after"] = momentAfter;
      } else {
        momentFrom = this.currentEventInput.start;
        momentTo = this.currentEventInput.end;
        if (momentFrom >= momentTo) {
          this.flux.store("FlashMessageStore").onDisplayFlashMessage({flashMessage: "Starting time should not be after or equal to ending time.", flashMessageType: "error", random: Math.random()});
          return;  
        }
        var l = this.getEvents().length;
        var events = this.getEvents();
        for (var i = 0; i < l; i += 1) {
          var item = events[i];
          if (item.mandatory && ((momentFrom <= item.end && momentFrom >= item.start) || (momentTo <= item.end && momentTo >= item.start))) {
            this.flux.store("FlashMessageStore").onDisplayFlashMessage({flashMessage: "You have a conflict in your fixed events.", flashMessageType: "error", random: Math.random()});
            return;
          }
        }
        clone["start"] = momentFrom;
        clone["end"] = momentTo;
      }
      this.getEvents().push(clone);
    
      // events are sorted based on start time for mandatory event and after time for non-mondatory event
      this.getEvents().sort(function(a, b) {
        var attrA = a.mandatory ? a.start : a.after;
        var attrB = b.mandatory ? b.start : b.after;
        if (attrA > attrB) {
          return 1;
        } else if (attrA < attrB) {
          return -1;
        } else {
          return 0;
        }
      })
      this.restoreForm();
      this.emit("change");
    },

    restoreForm: function() {
      this.currentEventInput = {
        location: "",
        title: "",
        category: "placeholder",
        start: null,
        mandatory: this.currentEventInput.mandatory,
        end: null,
        after: null,
        before: null,
        eventDescription: ""
      }
    },  

    onRemoveEvent: function(titleText) {
      // TO-DO: delete from id instead of names
      var events = this.getEvents();
      for (i = 0; i < l; i += 1) {
        e = events[i];
        if (e.title == titleText) {
          events.splice(i, 1);
          break
        }
      }
      this.emit("change");
    },

    onGetOptimizedSchedules: function() {
      var events = this.getEvents();
      if (events.length == 0) {
        this.flux.store("FlashMessageStore").onDisplayFlashMessage({flashMessage: Constants.FlashMessages.NO_EVENTS_TO_OPTIMIZE, flashMessageType: "error", random: Math.random()});
        return;
      }
      var json = events.map(function(item){
        return Adapters.eventAdapter(item);
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
          this.flux.store("ApplicationStore").onSetStepCount({stepCount: 1});
          this.flux.store("ApplicationStore").onSetMode({mode: "results-mode"});
        }.bind(this),
        error: function(xhr, status, err) {

        }.bind(this)
      });
      this.emit("change");
    },

    // assume optimzedResults are not yet cleared
    // TO-DO: support multiple results; user need to choose one
    onMergeResultsToCalendar: function() {
      var events = this.getEvents();
      this.optimizedResults.forEach(function(item) {
        if (!(events.some(function(original){
          return original.mandatory && (original.start - item.start == 0);}))) {
          events.push(item);
        }
      });
      events.filter(function(item){
        return !item.mandatory;
      });
      this.emit("change");
    },

    onClearOptimizedResults: function() {
      this.optimizedResults.splice(0, this.optimizedResults.length);
      this.emit("change");
    },

    getMandatoryEvents: function() {
      var events = this.getEvents();
      return events.filter(function(item){
        return item.mandatory;
      }).sort(function(a, b){
        return a.start.valueOf() - b.start.valueOf();
      });
    },

    getState: function() {
      this.setDependentValues();
      return {
        optimizedResults: this.optimizedResults,
        events: this.getEvents(),
        currentEventInput: this.currentEventInput
      };
    }
  });
  return EventStore;
});