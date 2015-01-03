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


  TR.Trace = function(other) {
    this.positions = other.positions ? other.positions : [];
    if (other.id) {
      this.id = other.id;
    } else if (other._id) {
      this.id = other._id;
    } else if (this.positions.length > 0) {
      this.id = this.positions[0].time = '';
    } else {
      this.id = Date.now() + '';
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
      return 123;
    },

    toDb: function() {
      return {
        _id: this.id,
        positions: this.positions
      }
    }
  };


  return TR;
})();
