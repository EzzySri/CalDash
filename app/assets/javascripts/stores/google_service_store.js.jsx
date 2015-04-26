define(['jquery', 'fluxxor', 'constants'], function($, Fluxxor, Constants){
  var GoogleServiceStore = Fluxxor.createStore({
    initialize: function() {
      this.geocoderService = null;
      this.locationService = null;
      this.directionsService = null;
      this.directionsRenderer = null;
      this.map = null;
      this.resultMap = null;
      this.routes = {};

      this.curDraggableMarker = null;

      var ActionTypes = Constants.ActionTypes;

      this.bindActions(
        ActionTypes.SET_GEOCODER_SERVICE, this.onSetGeocoderService,
        ActionTypes.SET_LOCATION_SERVICE, this.onSetLocationService,
        ActionTypes.RETRIEVE_GEO_LOCATION, this.onRetrieveGeoLocation,
        ActionTypes.SET_MAP, this.onSetMap,
        ActionTypes.SET_RESULT_MAP, this.onSetResultMap,
        ActionTypes.RETRIEVE_MAP_PREDICTIONS, this.onRetrieveMapPredictions,
        ActionTypes.DISPLAY_ROUTES_FOR_DAY, this.onDisplayRoutesForDay
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

    onSetResultMap: function() {
      var mapOptions = {
        zoom: 14
      }, map = this.resultMap;
      if (!map) {
        map = new google.maps.Map(document.getElementById('result-map'), mapOptions);
        this.resultMap =  map;
        if(navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = new google.maps.LatLng(position.coords.latitude,
                                             position.coords.longitude);
            var image = new google.maps.MarkerImage(
              Constants.Images.MAP_MARKER,
              null,
              null,
              null,
              new google.maps.Size(40, 40)
            );
            var marker = new google.maps.Marker({
              map: map,
              position: pos,
              title: 'You are here.',
              icon: image
            });
            map.setCenter(pos);
          }, function() {
            this.handleNoGeolocation(map, true);
          }.bind(this));

          /** set map toggle button */

          var switchMapButtonDiv = document.createElement('div');
          var switchMapButton = new this.SwitchMapButton(switchMapButtonDiv, map, this);
          switchMapButtonDiv.index = 2;
          map.controls[google.maps.ControlPosition.TOP_RIGHT].push(switchMapButtonDiv);

        } else {
          // Browser doesn't support Geolocation
          this.handleNoGeolocation(map, false);
        }
      }
    },

    onSetMap: function(payload) {
      var mapOptions = {
        zoom: 14
      }, map = this.map;
      if (!map) {
        map = new google.maps.Map(document.getElementById('interactive-map'), mapOptions);
        this.map =  map;
        if(navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = new google.maps.LatLng(position.coords.latitude,
                                             position.coords.longitude);
            var image = new google.maps.MarkerImage(
              Constants.Images.MAP_MARKER,
              null,
              null,
              null,
              new google.maps.Size(40, 40)
            );
            var marker = new google.maps.Marker({
              map: map,
              position: pos,
              title: 'You are here.',
              icon: image
            });
            map.setCenter(pos);
          }, function() {
            this.handleNoGeolocation(map, true);
          }.bind(this));

          google.maps.event.addListener(this.map, 'click', this.clickEventListener, this);

          /** set confirm button */

          var confirmButtonDiv = document.createElement('div');
          var confirmButton = new this.ConfirmButton(confirmButtonDiv, map, this);
          confirmButtonDiv.index = 1;
          map.controls[google.maps.ControlPosition.TOP_RIGHT].push(confirmButtonDiv);


          /** set map toggle button */

          var switchMapButtonDiv = document.createElement('div');
          var switchMapButton = new this.SwitchMapButton(switchMapButtonDiv, map, this);
          switchMapButtonDiv.index = 2;
          map.controls[google.maps.ControlPosition.TOP_RIGHT].push(switchMapButtonDiv);
        } else {
          // Browser doesn't support Geolocation
          this.handleNoGeolocation(map, false);
        }
      }
    },

    displayNewGeoLocationResult: function() {
      var lat = this.flux.store("EventStore").currentEventInput.lat;
      var lng = this.flux.store("EventStore").currentEventInput.lng;
      var location = this.flux.store("EventStore").currentEventInput.location;
      var geolocation;
      if (lat && lng) {
        geolocation = new google.maps.LatLng(lat, lng)
        this.map.setCenter(geolocation);
        var image = {
          url: Constants.Images.MAP_MARKER,
          size: new google.maps.Size(20, 32)
        };
        var image = new google.maps.MarkerImage(
          Constants.Images.MAP_MARKER,
          null,
          null,
          null,
          new google.maps.Size(40, 40)
        );
        var bounds = new google.maps.LatLngBounds();
        bounds.extend(geolocation);
        this.flux.store("EventStore").getEvents().map(function(item){
          if (item.lat && item.lng) {
            bounds.extend(new google.maps.LatLng(item.lat, item.lng));
          }
        });
        this.map.fitBounds(bounds);
        var marker = new google.maps.Marker({
          map: this.map,
          position: geolocation,
          title: location,
          icon: image
        });
      }
    },

    clickEventListener: function(event) {
      if (!this.curDraggableMarker) {
        this.placeCurDraggableMarker(event.latLng, "Drag me!", true);
      } else {
        this.flux.store("FlashMessageStore").onDisplayFlashMessage({
          flashMessage: "Please drag or double-click to cancel the existing selection icon.",
          flashMessageType: "error",
          random: Math.random()});
      }
      google.maps.event.addListener(this.curDraggableMarker, 'dblclick', this.dblClickMarkerListener, this);
      google.maps.event.addListener(this.curDraggableMarker,'dragend', this.markerDragendListener, this);
      this.emit("change");
    },

    markerDragendListener: function(event) {
      this.retrieveReverseGeoOnMarker(event.latLng);
    },

    retrieveReverseGeoOnMarker: function(markerLatLng) {
      var service = this.geocoderService;
      if (!service) {
        service = new google.maps.Geocoder();
        this.geocoderService = service;
      }
      var context = this;
      service.geocode({'latLng': markerLatLng}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          store = context.flux.store("EventStore");
          store.onSetLocation({location: results[0].formatted_address});
          store.currentEventInput.lat = results[0].geometry.location.lat();
          store.currentEventInput.lng = results[0].geometry.location.lng();
          context.displayNewGeoLocationResult();
          context.emit("change");
        } else {
          this.flux.store("FlashMessageStore").onDisplayFlashMessage({
            flashMessage: "Geocoder service error.",
            flashMessageType: "error",
            random: Math.random()});          
        }
      });
    },

    dblClickMarkerListener: function() {
      this.curDraggableMarker.setMap(null);
      this.curDraggableMarker = null;
      this.emit("change");
    },

    placeCurDraggableMarker: function(geolocation, locationText, isDraggable) {
      var image = new google.maps.MarkerImage(
        Constants.Images.MAP_BLACK_MARKER,
        null,
        null,
        null,
        new google.maps.Size(40, 40)
      );
      this.curDraggableMarker = new google.maps.Marker({
        map: this.map,
        position: geolocation,
        title: locationText,
        draggable: isDraggable,
        icon: image        
      });
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
            context.flux.store("EventStore").currentEventInput.lat = results[0].geometry.location.lat();
            context.flux.store("EventStore").currentEventInput.lng = results[0].geometry.location.lng();
            context.displayNewGeoLocationResult();
            context.emit("change");
          } else {
            this.flux.store("FlashMessageStore").onDisplayFlashMessage({
              flashMessage: "Geocode was not successful for the following reason: " + status,
              flashMessageType: "error",
              random: Math.random()});
          }
        });
      }
      this.emit("change");
    },

    onRetrieveMapPredictions: function(payload) {
      var service = this.locationService;
      var loc = payload.locationInput;
      
      if (!service) {
        service = new google.maps.places.AutocompleteService();
        this.locationService = service;
      }

      if (loc != "") {
        if (loc in this.flux.store("PredictionStore").cache) {
          var cached = this.flux.store("PredictionStore").cache[loc];
          this.flux.store("PredictionStore").onSetPredictions({locationInput: loc, predictions: cached});
          this.emit("change");
        } else {
          var context = this;
          service.getQueryPredictions({input: loc}, function(predictions, status) {
              if (status != google.maps.places.PlacesServiceStatus.OK) {
                return;
              }
              context.flux.actions.predictionActions.setPredictions(loc, predictions);
              context.emit("change");
            }
          );
        }
      } else {
        this.flux.store("PredictionStore").onClearPredictions();
      }

      this.emit("change");
    },

    onDisplayRoutesForDay: function() {
      var dayInUnix = moment(this.flux.store("ApplicationStore").getState().selectedDay).startOf("day").valueOf();
      var events = this.flux.store("EventStore").getEvents();
      var response = this.routes[dayInUnix];
      var service = this.directionsRenderer;
      if (!service) {
        service = new google.maps.DirectionsRenderer();
        this.directionsRenderer = service;
      }
      service.setMap(this.resultMap);
      if (events.length > 0 && !response) {
        this.flux.store("EventStore").onSetRoutesForDay();
      } else if (events.length > 0 && response) {
        service.setDirections(response);
      } else {
        service.setMap(null);
      }
      this.emit("change");
    },

    getState: function() {
      return {
        geocoderService: this.geocoderService,
        locationService: this.locationService,
        map: this.map,
        resultMap: this.resultMap
      };
    },

    /** map buttons */

    ConfirmButton: function(controlDiv, map, context) {
      var controlUI = document.createElement('div');
      controlUI.style.backgroundColor = '#fff';
      controlUI.style.marginRight = '-5px';
      controlUI.style.border = '1px solid rgba(0, 0, 0, 0.14902)';
      controlUI.style.boxShadow = "rgba(0, 0, 0, 0.298039) 0px 1px 4px -1px";
      controlUI.style.webkitBoxShadow = "rgba(0, 0, 0, 0.298039) 0px 1px 4px -1px";
      controlUI.style.borderRadius = '1px';
      controlUI.style.cursor = 'pointer';
      controlUI.style.marginTop = '5px';
      controlUI.style.textAlign = 'center';
      controlUI.title = 'Click to confirm location input';
      controlDiv.appendChild(controlUI);

      var controlText = document.createElement('div');
      controlText.style.padding = '1px 6px';
      controlText.innerHTML = 'Confirm Location';
      controlUI.appendChild(controlText);

      google.maps.event.addDomListener(controlUI, 'click', function(event) {
        context.retrieveReverseGeoOnMarker(context.curDraggableMarker.getPosition());
        context.curDraggableMarker.setMap(null);
        context.curDraggableMarker = null;
        context.emit("change");
      }, context);
    },

    SwitchMapButton: function(controlDiv, map, context) {
      var controlUI = document.createElement('div');
      controlUI.style.backgroundColor = '#fff';
      controlUI.style.marginRight = '-5px';
      controlUI.style.border = '1px solid rgba(0, 0, 0, 0.14902)';
      controlUI.style.boxShadow = "rgba(0, 0, 0, 0.298039) 0px 1px 4px -1px";
      controlUI.style.webkitBoxShadow = "rgba(0, 0, 0, 0.298039) 0px 1px 4px -1px";
      controlUI.style.borderRadius = '1px';
      controlUI.style.cursor = 'pointer';
      controlUI.style.marginTop = '5px';
      controlUI.style.textAlign = 'center';
      controlUI.title = 'Toggle between interactive and result mode';
      controlDiv.appendChild(controlUI);

      var controlText = document.createElement('div');
      controlText.style.padding = '1px 6px';
      controlText.innerHTML = 'Toggle Routes';
      controlUI.appendChild(controlText);

      google.maps.event.addDomListener(controlUI, 'click', function(event) {
        var appStore = context.flux.store("ApplicationStore");
        appStore.onToggleMapMode();
        var map = appStore.getState().mapMode == "interactive-mode" ? context.map : context.resultMap;
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
      }, context);
    },    

    /** utils */

    /** all arguments are LatLng Type */
    fetchAndDisplayRoutes: function(origin, waypoints, dest) {
      var service = this.directionsService;
      if (!service) {
        service = new google.maps.DirectionsService();
        this.directionsService = service;
      }

      var request = {
          origin: origin,
          destination: dest,
          waypoints: waypoints,
          optimizeWaypoints: true,
          travelMode: google.maps.TravelMode.DRIVING
      };
      var context = this;
      service.route(request, function(response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
          context.routes[moment(this.flux.store("ApplicationStore").selectedDay).startOf("day").valueOf()] = response;
          var service = context.directionsRenderer;
          if (!service) {
            service = new google.maps.DirectionsRenderer();
            context.directionsRenderer = service;
          }
          service.setMap(context.resultMap);
          service.setDirections(response);
        } else {
          context.flux.store("FlashMessageStore").onDisplayFlashMessage({
            flashMessage: "DirectionsService was not successful for the following reason: " + status,
            flashMessageType: "error",
            random: Math.random()});
        }
      }, context);
    }
  });
  return GoogleServiceStore;
});