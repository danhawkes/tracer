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
      this.id = 'trace_' + Date.now();
      this.date = Date.now() + '';
      this.positions = [];
    };

    // From DB
    this.construct2 = function(dbTrace) {
      this.id = dbTrace._id;
      this.date = dbTrace.date;
      this.positions = dbTrace.positions;
    };

    // Copy
    this.construct3 = function(trace) {
      this.id = trace.id;
      this.date = trace.date;
      this.positions = trace.positions;
    };

    if (param === undefined) {
      this.construct1();
    } else if (param._id !== undefined) {
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
      return this.duration() / 10000.0;
    },

    toDb: function() {
      return {
        _id: this.id,
        positions: this.positions,
        date: this.date,
        type: 'trace'
      }
    }
  };


  return TR;
})();
