var connect = require('connect');
var compression = require('compression');
var serveStatic = require('serve-static');

var port = process.env.PORT || 8080;

var app = connect();
app.use(compression());
app.use(serveStatic(__dirname + '/dist'));
app.listen(port);
