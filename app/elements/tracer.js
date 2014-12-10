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


  TR.Trace = function(name) {
    this.name = name;
    this.positions = [];
  };

  TR.Trace.prototype = {

    appendPosition: function(position) {
      this.positions.push(position);
    },

    toString: function() {
      return this.name + '(' + this.positions.length + ')';
    },

    toDb: function(id) {
      return {
        _id: id,
        positions: this.positions
      }
    }
  }


  return TR;

})();
