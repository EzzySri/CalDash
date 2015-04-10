define(['jquery', 'fluxxor', 'constants'], function($, Fluxxor, Constants){
  var PredictionStore = Fluxxor.createStore({
    initialize: function() {
      this.predictions = [];

      var ActionTypes = Constants.ActionTypes;

      this.bindActions(
        ActionTypes.SET_PREDICTIONS, this.onSetPredictions,
        ActionTypes.CLEAR_PREDICTIONS, this.onClearPredictions
      );
    },

    onSetPredictions: function(payload) {
      // TO-DO: add unique id to store objects
      this.predictions.splice(0, this.predictions.length);
      payload.predictions.forEach(function(v) {this.push(v)}, this.predictions);
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