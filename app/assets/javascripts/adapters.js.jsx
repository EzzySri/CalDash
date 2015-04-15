define(['constants', 'moment'], function(Constants, moment){

  var Adapters = {
    eventAdapter: function(eventParams) {
      var event = {
        mandatory: eventParams.mandatory,
        name: eventParams.title,
        category: eventParams.category,
        description: eventParams.eventDescription,
        lat: eventParams.lat,
        lng: eventParams.lng,
        location: eventParams.location
      };
      if (event.mandatory) {
        event.start_unix = eventParams.start.valueOf();
        event.end_unix = eventParams.end.valueOf();
      } else {
        event.before_unix = eventParams.before.valueOf();
        event.after_unix = eventParams.after.valueOf();
        event.duration_in_miliseconds = eventParams.duration.valueOf();
      }
      return event;
    },
    reverseEventAdapter: function(eventParams) {
      var event = {
        mandatory: eventParams.mandatory,
        title: eventParams.name,
        category: eventParams.category,
        eventDescription: eventParams.description,
        lat: eventParams.lat,
        lng: eventParams.lng,
        location: eventParams.location,
      };
      if (event.mandatory) {
        event.start = moment(parseInt(eventParams.start_unix));
        event.end = moment(parseInt(eventParams.end_unix));
      } else {
        event.before = moment(parseInt(eventParams.before_unix));
        event.after = moment(parseInt(eventParams.after_unix));
        event.duration = moment.duration(parseInt(eventParams.duration_in_miliseconds));
      }
      return event;
    },
    eventAssignmentAdapter: function(eventParams) {
      if (!(eventParams.mandatory && eventParams.start && eventParams.end)) throw "ValueError";
      return {
        name: eventParams.title,
        category: eventParams.category,
        description: eventParams.eventDescription,
        lat: eventParams.lat,
        lng: eventParams.lng,
        location: eventParams.location,
        start_unix: eventParams.start.valueOf(),
        end_unix: eventParams.end.valueOf()
      };
    }
  };
  return Adapters;
});