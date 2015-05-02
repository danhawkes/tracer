(function() {

  TR = window.TR || {};


  TR.Position = function(lat, lng) {
    this.time = Date.now();
    this.lat = lat;
    this.lng = lng;
  };

  TR.Position.prototype = {

    toString: function() {
      return '[' + this.time + ', (' + this.lat + ', ' + this.lng + ')]';
    }
  };


  TR.Trace = function(param) {

    // New
    this.construct1 = function() {
      var now = Date.now();
      this._id = 'trace_' + now;
      this.date = now;
      this.title = new Date(this.date).toLocaleDateString('en', {
        hour12: true,
        minute: 'numeric',
        hour: 'numeric',
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
      this.positions = [];
      this.type = 'trace';
    };

    // From DB map
    this.construct2 = function(dbItem) {
      this._id = dbItem.id;
      this.date = dbItem.value.date;
      this.title = dbItem.value.title;
      this.type = 'trace';
    };

    // Copy
    this.construct3 = function(trace) {
      this._id = trace._id;
      this.date = trace.date;
      this.title = trace.title;
      this.positions = trace.positions;
      this.type = 'trace';
    };

    if (param === undefined) {
      this.construct1();
    } else if (param.id !== undefined) {
      this.construct2(param);
    } else {
      this.construct3(param);
    }
  };

  TR.Trace.prototype = {

    appendPosition: function(position) {
      this.positions.push(position);
    },

    duration: function() {
      if (this.positions.length > 1) {
        return this.positions[this.positions.length - 1].time - this.positions[0].time;
      } else {
        return 0;
      }
    },

    elevationChange: function() {
      return 'unknown';
    },

    length: function() {
      var dist = 0;
      if (this.positions.length > 1) {


        if (typeof(Number.prototype.toRad) === "undefined") {
          Number.prototype.toRad = function() {
            return this * Math.PI / 180;
          }
        }

        // Distance in kilometers between two points using the Haversine algo.
        function haversine(lat1, lon1, lat2, lon2) {
          var R = 6371;
          var dLat = (lat2 - lat1).toRad();
          var dLong = (lon2 - lon1).toRad();

          var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
          var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          return  R * c;
        }

        var p1 = this.positions[0];
        var i, len;
        for (i = 1, len = this.positions.length; i < len; i++) {
          var p2 = this.positions[i];
          dist += haversine(p1.lat, p1.lng, p2.lat, p2.lng);
          p1 = p2;
        }
      }


      return dist;
    },

    toDb: function() {
      return {
        _id: this._id,
        date: this.date,
        title: this.title,
        positions: this.positions,
        type: this.type
      }
    }
  };


  return TR;
})();
