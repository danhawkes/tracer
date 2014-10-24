Mocks = (function() {

  var geolocation = function() {

    var watchPosition = function(a, b, c) {
      var lat = 53.4729278;
      var lng = -2.2939576;
      var fn = function() {
        lat += (Math.random() - 0.3) * 0.001;
        lng += (Math.random() - 0.3) * 0.001;
        var pos = {
          coords: {
            latitude: lat,
            longitude: lng
          }
        };
        a(pos);
      };
      return setInterval(fn, 2000);
    };

    var clearWatch = function(watchId) {
      clearInterval(watchId);
    };

    return {
      watchPosition: watchPosition,
      clearWatch: clearWatch
    };
  }

  return {
    geolocation: geolocation
  }

})();
