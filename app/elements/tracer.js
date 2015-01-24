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
      this.title = this.date + '';
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
      return this.duration() / 10000.0;
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
