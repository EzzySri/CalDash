define(['jquery', 'fluxxor', 'constants'], function($, Fluxxor, Constants){
  var PredictionStore = Fluxxor.createStore({
    initialize: function() {
      this.predictions = [];

      this.cache = {};

      var ActionTypes = Constants.ActionTypes;

      this.bindActions(
        ActionTypes.SET_PREDICTIONS, this.onSetPredictions,
        ActionTypes.CLEAR_PREDICTIONS, this.onClearPredictions
      );
    },

    onSetPredictions: function(payload) {
      this.predictions.splice(0, this.predictions.length);
      payload.predictions.forEach(function(v) {this.push(v)}, this.predictions);
      this.cache[payload.locationInput] = $.extend([], this.predictions);
      this.emit("change");
    },

    onClearPredictions: function() {
      this.predictions.splice(0, this.predictions.length);
      this.emit("change");
    },

    getState: function() {
      return {
        predictions: this.predictions
      };
    }
  });
  return PredictionStore;
});