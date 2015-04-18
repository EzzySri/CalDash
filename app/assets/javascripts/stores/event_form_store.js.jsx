define(['jquery', 'fluxxor', 'constants', 'moment'], function($, Fluxxor, Constants, moment){
  var EventFormStore = Fluxxor.createStore({
    initialize: function() {
      this.timeOptions = null;
      this.durationOptions = null;
    
      var ActionTypes = Constants.ActionTypes;

      this.bindActions(
      );
    },

    setDependentValues: function() {
      this.timeOptions = this.getTimeOptions();
      if (this.durationOptions == null) {
        this.durationOptions = this.getDurationOptions();
      }
    },

    getTimeOptions: function() {
      var startOfDay = moment(this.flux.store("ApplicationStore").selectedDay).startOf('day');
      var times = [startOfDay.clone()];
      for (i = 1; i < 48; i += 1) {
        times.push(startOfDay.add(30, "m").clone());
      }
      times.push(startOfDay.add(29, "m").clone());
      return times;
    },  

    getDurationOptions: function() {
      var startDuration = moment.duration(15, "m");
      var durations = [moment.duration(startDuration)];
      for (i = 1; i < 48; i += 1) {
        durations.push(moment.duration(startDuration.add(15, "m")));
      }
      return durations;
    },

    getState: function() {
      this.setDependentValues();
      return {
        timeOptions: this.timeOptions,
        durationOptions: this.durationOptions
      };
    }
  });
  return EventFormStore;
});