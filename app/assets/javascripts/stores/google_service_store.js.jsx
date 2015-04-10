define(['jquery', 'fluxxor', 'constants'], function($, Fluxxor, Constants){
  var GoogleServiceStore = Fluxxor.createStore({
    initialize: function() {
      this.geocoderService = null;
      this.locationService = null;
      this.newGeoLocationResult = null;
      this.map = null;

      var ActionTypes = Constants.ActionTypes;

      this.bindActions(
        ActionTypes.SET_GEOCODER_SERVICE, this.onSetGeocoderService,
        ActionTypes.SET_LOCATION_SERVICE, this.onSetLocationService,
        ActionTypes.RETRIEVE_GEO_LOCATION, this.onRetrieveGeoLocation,
        ActionTypes.SET_MAP, this.onSetMap
      );
    },

    onSetGeocoderService: function(payload) {
      this.geocoderService = payload.geocoderService;
      this.emit("change");
    },

    onSetLocationService: function(payload) {
      this.locationService = payload.locationService;
      this.emit("change");
    },

    onSetMap: function(payload) {
      var mapOptions = {
        zoom: 14
      }, map = this.map;
      if (!map) {
        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
        this.map =  map;
        if(navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = new google.maps.LatLng(position.coords.latitude,
                                             position.coords.longitude);
            var infowindow = new google.maps.InfoWindow({
              map: map,
              position: pos,
              content: 'You are here.'
            });
            map.setCenter(pos);
          }, function() {
            this.handleNoGeolocation(map, true);
          }.bind(this));
        } else {
          // Browser doesn't support Geolocation
          this.handleNoGeolocation(map, false);
        }
      }
    },

    displayNewGeoLocationResult: function() {
      if (this.newGeoLocationResult) {
        var result = this.newGeoLocationResult;
        this.map.setCenter(result.geometry.location);
        var marker = new google.maps.Marker({
          map: this.map,
          position: result.geometry.location,
          title: result.formatted_address
        });
      }
    },

    handleNoGeolocation: function(map, errorFlag) {
      if (errorFlag) {
        var content = 'Error: The Geolocation service failed.';
      } else {
        var content = 'Error: Your browser doesn\'t support geolocation.';
      }
      var options = {
        map: this.map,
        position: new google.maps.LatLng(60, 105),
        content: content
      };
      
      var infowindow = new google.maps.InfoWindow(options);
      this.map.setCenter(options.position);
    },

    onRetrieveGeoLocation: function() {
      var currentEventInput = this.flux.store("EventStore").currentEventInput;
      var context = this;
      var service = this.geocoderService;
      if (!service) {
        service = new google.maps.Geocoder();
        this.geocoderService = service;
      }
      if (currentEventInput.location) {
        service.geocode({'address': currentEventInput.location}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
            context.newGeoLocationResult = results[0];
            context.displayNewGeoLocationResult();
            context.emit("change");
          } else {
            alert("Geocode was not successful for the following reason: " + status);
          }
        });
      }
      this.emit("change");
    },

    getState: function() {
      return {
        geocoderService: this.geocoderService,
        locationService: this.locationService,
        newGeoLocationResult: this.newGeoLocationResult,
        map: this.map
      };
    }
  });
  return GoogleServiceStore;
});