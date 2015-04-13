define(['jquery', 'fluxxor', 'constants'], function($, Fluxxor, Constants){
  var FlashMessageStore = Fluxxor.createStore({
    initialize: function() {
      this.flashMessage = "";
      this.flashMessageType = "";
      this.flashMessageRandom = 0;

      var ActionTypes = Constants.ActionTypes;

      this.bindActions(
        ActionTypes.DISPLAY_FLASH_MESSAGE, this.onDisplayFlashMessage,
        ActionTypes.CLEAR_FLASH_MESSAGE, this.onClearFlashMessage
      );
    },

    setFlashMessage: function(message, type, random) {
      this.flashMessage = message;
      this.flashMessageType = type;
      this.flashMessageRandom = random;
    },

    onClearFlashMessage: function() {
      this.flashMessage = "";
      this.flashMessageType = "";
      this.emit("change");
    },

    onDisplayFlashMessage: function(payload) {
      if ($(".error-message-container").css("height") == "0px") {
        this.setFlashMessage(payload.flashMessage, payload.flashMessageType, payload.random);
        this.emit("change");
      }
    },

    getState: function() {
      return {
        flashMessage: this.flashMessage,
        flashMessageType: this.flashMessageType,
        flashMessageRandom: this.flashMessageRandom
      };
    }
  });
  return FlashMessageStore;
});