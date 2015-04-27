define(['jquery', 'fluxxor', 'constants', 'moment', 'adapters'], function($, Fluxxor, Constants, moment, Adapters){
  var EventStore = Fluxxor.createStore({
    initialize: function() {
      this.allEvents = {};
      // stored temporarily; cleared after user confirms his choice
      this.optimizedResults = [];
      this.recentEvents = [];

      this.currentEventInput = {
        location: "",
        mandatory: false,
        name: "",
        category: "placeholder",
        start: null,
        end: null,
        after: null,
        before: null,
        eventDescription: "",
        lat: null,
        lng: null,
        isPrivate: false,
        repeatType: "once",
        repeatBegin: null,
        repeatEnd: null,
        repeatDays: [],
        schedule: ""
      },

      this.bindActions(
        Constants.ADD_EVENT, this.onAddEvent,
        Constants.REMOVE_EVENT, this.onRemoveEvent,
        Constants.GET_OPTIMIZED_SCHEDULES, this.onGetOptimizedSchedules,
        Constants.CLEAR_OPTIMIZED_RESULTS, this.onClearOptimizedResults,
        Constants.MERGE_RESULTS_TO_CALENDAR, this.onMergeResultsToCalendar,
        Constants.ActionTypes.SET_LOCATION, this.onSetLocation,
        Constants.ActionTypes.SET_MANDATORY, this.onSetMandatory,
        Constants.ActionTypes.SET_NAME, this.onSetName,
        Constants.ActionTypes.SET_CATEGORY, this.onSetCategory,
        Constants.ActionTypes.SET_AFTER_TIME, this.onSetAfterTime,
        Constants.ActionTypes.SET_BEFORE_TIME, this.onSetBeforeTime,
        Constants.ActionTypes.SET_START_TIME, this.onSetStartTime,
        Constants.ActionTypes.SET_END_TIME, this.onSetEndTime,
        Constants.ActionTypes.SET_DURATION, this.onSetDuration,
        Constants.ActionTypes.SET_EVENT_DESCRIPTION, this.onSetEventDescription,
        Constants.ActionTypes.SYNC_SCHEDULE_CHOICE, this.onSyncScheduleChoice,
        Constants.ActionTypes.BATCH_FETCH_EVENTS, this.onBatchFetchEvents,
        Constants.ActionTypes.SET_ROUTES_FOR_DAY, this.onSetRoutesForDay,
        Constants.ActionTypes.FETCH_RECENT_EVENTS, this.onFetchRecentEvents
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

    onFetchRecentEvents: function() {

      if (!this.flux.store("SessionStore").checkAndRedirect()) {
        return;
      }

      $.ajax({
        url: Constants.APIEndpoints.FETCH_RECENT_EVENTS,
        method: "GET",
        dataType: "json",
        contentType: 'application/json',
        data: {size: Constants.RECENT_EVENT_COUNT},
        success: function(data) {
          this.recentEvents = data.event_assignments.map(function(event){
            return Adapters.reverseEventAssignmentAdapter(event);
          });
          this.emit("change");
        }.bind(this),
        error: function(xhr, status, err) {
          // TO-DO
          this.emit("change");
        }.bind(this)
      });
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

    onSetName: function(payload) {
      this.currentEventInput.name = payload.name;
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
      var selectedDayUnix = moment(this.flux.store("ApplicationStore").getState().selectedDay).startOf("day").valueOf();
      if (!(selectedDayUnix in this.allEvents)) {
        this.allEvents[selectedDayUnix] = [];
        this.fetchDayEvents(selectedDayUnix);
      }
      return this.allEvents[selectedDayUnix];
    },

    fetchDayEvents: function(dateInUnix) {

      if (!this.flux.store("SessionStore").checkAndRedirect()) {
        return;
      }

      $.ajax({
        url: Constants.APIEndpoints.FETCH_DAY_EVENTS,
        method: "GET",
        dataType: "json",
        contentType: 'application/json',
        data: {date_in_unix: dateInUnix / 1000},
        success: function(data) {
          this.allEvents[dateInUnix] = data.event_assignments.map(function(event){
            return Adapters.reverseEventAssignmentAdapter(event);
          });
          this.onSetRoutesForDay();
          this.emit("change");
        }.bind(this),
        error: function(xhr, status, err) {
          // TO-DO
          this.emit("change");
        }.bind(this)
      });
    },

    onBatchFetchEvents: function(payload) {

      if (!this.flux.store("SessionStore").checkAndRedirect()) {
        return;
      }

      $.ajax({
        url: Constants.APIEndpoints.BATCH_FETCH_EVENTS,
        method: "GET",
        dataType: "json",
        contentType: 'application/json',
        data: {
          date_start: payload.dateStart / 1000,
          date_end: payload.dateEnd / 1000
        },
        success: function(data) {
          Object.keys(data.event_assignments).map(function(key){
            // this is already time at start of day
            var dateInUnix = parseInt(key) * 1000;
            if (!this.allEvents[dateInUnix]) {
              this.allEvents[dateInUnix] = data.event_assignments[key].map(function(event){
                return Adapters.reverseEventAssignmentAdapter(event); 
              }, this);
            }
          }, this);
          this.emit("change");
        }.bind(this),
        error: function(xhr, status, err) {
          // TO-DO
          this.emit("change");
        }.bind(this)
      });
    },

    onSyncScheduleChoice: function () {

      if (!this.flux.store("SessionStore").checkAndRedirect()) {
        return;
      }

      var eventAssignments = this.optimizedResults.map(function(item){
        return Adapters.eventAssignmentAdapter(item);
      });
      $.ajax({
        url: Constants.APIEndpoints.EVENT_ASSIGNMENTS_BATCH_CREATE,
        method: "POST",
        dataType: "json",
        contentType: 'application/json',
        data: JSON.stringify({
          date_in_unix: moment(this.flux.store("ApplicationStore").getState().selectedDay).startOf("day").valueOf() / 1000,
          event_assignments: eventAssignments
        }),
        success: function(data) {
          this.onClearOptimizedResults();
        }.bind(this),
        error: function(xhr, status, err) {
          this.flux.store("FlashMessageStore").onDisplayFlashMessage({
            flashMessage: "Event update is not successful for the following reason: " + err,
            flashMessageType: "error",
            random: Math.random()});
        }.bind(this)
      });
      this.emit("change");
    },

    onAddEvent: function() {

      if (!this.flux.store("SessionStore").checkAndRedirect()) {
        return;
      }

      // TO-DO: add unique id to store objects
      var name = this.currentEventInput.name;
      var category = this.currentEventInput.category;
      var location = this.currentEventInput.location;
      if (!(name && location && category != "placeholder")) {
        this.flux.store("FlashMessageStore").onDisplayFlashMessage({flashMessage: "Event Name, Category and Location should not be empty.", flashMessageType: "error", random: Math.random()});
        return;
      }
      var clone = {
        location: location,
        category: category,
        mandatory: this.currentEventInput.mandatory,
        name: name,
        duration: this.currentEventInput.duration,
        eventDescription: this.currentEventInput.eventDescription,
        lat: this.currentEventInput.lat,
        lng: this.currentEventInput.lng,
        isPrivate: this.currentEventInput.isPrivate,
        repeatType: this.currentEventInput.repeatType,
        repeatBegin: this.currentEventInput.repeatBegin,
        repeatEnd: this.currentEventInput.repeatEnd,
        repeatDays: this.currentEventInput.repeatDays
      };
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
        name: "",
        category: "placeholder",
        start: null,
        mandatory: this.currentEventInput.mandatory,
        end: null,
        after: null,
        before: null,
        eventDescription: "",
        lat: null,
        lng: null,
        isPrivate: false,
        repeatType: "once",
        repeatBegin: null,
        repeatEnd: null,
        repeatDays: [],
        schedule: ""
      }
    },  

    onRemoveEvent: function(nameText) {
      // TO-DO: delete from id instead of names
      var events = this.getEvents();
      var l = events.length;
      for (i = 0; i < l; i += 1) {
        e = events[i];
        if (e.name == nameText) {
          events.splice(i, 1);
          break
        }
      }
      this.emit("change");
    },

    onGetOptimizedSchedules: function() {

      if (!this.flux.store("SessionStore").checkAndRedirect()) {
        return;
      }

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
        contentType: "application/json",
        data: JSON.stringify({events: json}), 
        success: function(data) {
          data.schedules.forEach(function(schedule){
            schedule.forEach(function(event){
              // TO-DO: no multiple results display yet; all add to this single array
              this.optimizedResults.push(Adapters.reverseEventAdapter(event));
            }, this);
          }, this);
          this.flux.store("ApplicationStore").onSetStepCount({stepCount: 1});
          this.flux.store("ApplicationStore").onSetMode({mode: "results-mode"});
        }.bind(this),
        error: function(xhr, status, err) {
          this.flux.store("FlashMessageStore").onDisplayFlashMessage({
            flashMessage: "Optimization is not successful for the following reason: " + err,
            flashMessageType: "error",
            random: Math.random()});
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

      for (var i = 0; i < events.length; i += 1) {
        if (!events[i].mandatory) {
          events.splice(i, 1);
          i -= 1;
        }
      }
      
      events.filter(function(item){
        return !item.mandatory;
      });
      this.emit("change");
    },

    onSetRoutesForDay: function() {
      var mandEvents =  this.getMandatoryEvents();
      if (mandEvents.length <= 1) return;
      var sortedEvents = mandEvents.sort(function(a, b) {
        return (a.start.valueOf() - b.start.valueOf());
      });
      var startPosition = new google.maps.LatLng(mandEvents[0].lat, mandEvents[0].lng);
      var endPosition = new google.maps.LatLng(mandEvents[mandEvents.length - 1].lat, mandEvents[mandEvents.length - 1].lng);
      var waypoints = mandEvents.slice(1, mandEvents.length).map(function(event, index){
        return {location: new google.maps.LatLng(event.lat, event.lng)};
      });
      this.flux.store("GoogleServiceStore").fetchAndDisplayRoutes(startPosition, waypoints, endPosition);
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
        allEvents: this.allEvents,
        optimizedResults: this.optimizedResults,
        events: this.getEvents(),
        recentEvents: this.recentEvents,
        currentEventInput: this.currentEventInput
      };
    }

    /** helpers */
  });
  return EventStore;
});