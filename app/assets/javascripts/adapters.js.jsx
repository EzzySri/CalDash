define(['constants', 'moment'], function(Constants, moment){

  var Adapters = {
    // TO-DO: / 1000 for all unix values
    eventAdapter: function(eventParams) {
      var event = {
        mandatory: eventParams.mandatory,
        name: eventParams.name,
        category: eventParams.category,
        description: eventParams.eventDescription,
        lat: eventParams.lat,
        lng: eventParams.lng,
        location: eventParams.location,
        is_private: eventParams.isPrivate,
        repeat_type: eventParams.repeatType,
        repeat_begin: eventParams.repeatBegin,
        repeat_end: eventParams.repeatEnd,
        repeat_days: eventParams.repeatDays
      };
      if (event.mandatory) {
        event.start_unix = eventParams.start.valueOf() / 1000;
        event.end_unix = eventParams.end.valueOf() / 1000;
      } else {
        event.before_unix = eventParams.before.valueOf() / 1000;
        event.after_unix = eventParams.after.valueOf() / 1000;
        event.duration_in_miliseconds = eventParams.duration.valueOf() / 1000;
      }
      return event;
    },
    reverseEventAdapter: function(eventParams) {
      var event = {
        mandatory: eventParams.mandatory,
        name: eventParams.name,
        category: eventParams.category,
        eventDescription: eventParams.description,
        lat: eventParams.lat,
        lng: eventParams.lng,
        location: eventParams.location,
        isPrivate: eventParams.is_private,
        repeatType: eventParams.repeat_type,
        schedule: eventParams.schedule
      };
      if (event.mandatory) {
        event.start = moment(parseInt(eventParams.start_unix * 1000));
        event.end = moment(parseInt(eventParams.end_unix * 1000));
      } else {
        event.before = moment(parseInt(eventParams.before_unix * 1000));
        event.after = moment(parseInt(eventParams.after_unix * 1000));
        event.duration = moment.duration(parseInt(eventParams.duration_in_miliseconds));
      }
      return event;
    },
    eventAssignmentAdapter: function(eventParams) {
      if (!(eventParams.mandatory && eventParams.start && eventParams.end)) throw "ValueError";
      return {
        mandatory: eventParams.mandatory,
        name: eventParams.name,
        category: eventParams.category,
        description: eventParams.eventDescription,
        lat: eventParams.lat,
        lng: eventParams.lng,
        location: eventParams.location,
        start_unix: eventParams.start.valueOf() / 1000,
        end_unix: eventParams.end.valueOf() / 1000,
        is_private: eventParams.isPrivate,
        repeat_type: eventParams.repeatType,
        schedule: eventParams.schedule
      };
    },
    reverseEventAssignmentAdapter: function(eventParams) {
      return {
        mandatory: eventParams.mandatory,
        name: eventParams.name,
        category: eventParams.category,
        eventDescription: eventParams.description,
        lat: eventParams.lat,
        lng: eventParams.lng,
        location: eventParams.location,
        start: moment(parseInt(eventParams.start_unix.valueOf() * 1000)),
        end: moment(parseInt(eventParams.end_unix.valueOf() * 1000)),
        repeatType: eventParams.repeat_type,
        isPrivate: eventParams.is_private,
        schedule: eventParams.schedule
      };
    }
  };
  return Adapters;
});