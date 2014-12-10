Mocks = (function() {

  var geolocation = function() {

    var baseLat = 53.4729278;
    var baseLng = -2.2939576;

    var watchPosition = function(success, error, options) {

      var a = 0.01 * Math.random();
      var t = 0.0;
      var delta = 0.1 * Math.random();
      var fn = function() {
        lat = baseLat + (a * t * Math.cos(t));
        lng = baseLng + (a * t * Math.sin(t));
        t += delta;
        var pos = {
          coords: {
            latitude: lat,
            longitude: lng
          }
        };
        success(pos);
      };
      return setInterval(fn, 200);
    };

    var getCurrentPosition = function(success, error, options) {
      setTimeout(function() {
        var pos = {
          coords: {
            latitude: baseLat,
            longitude: baseLng
          }
        };
        success(pos);
      }, 1000);
    }

    var clearWatch = function(watchId) {
      clearInterval(watchId);
    };

    return {
      watchPosition: watchPosition,
      clearWatch: clearWatch,
      getCurrentPosition: getCurrentPosition
    };
  }

  return {
    geolocation: geolocation
  }

})();
