var express = require('express');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');

var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.static('dist'));
app.use(morgan('dev'))
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(passport.initialize());

passport.use(new LocalStrategy(
  function(username, password, done) {
    console.log('handling request');
    authenticateUser(username, password, done);
  }
));


app.post('/register', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  if (username && password) {
    createUser(username, password, function(err, user) {
      if (err) {
        res.status(400).json({error: 'createfailed', description: err.message});
      } else {
        res.json(user);
      }
    });
  } else {
    res.status(400).send();
  }
});


app.post('/login', function(req, res, next) {
  passport.authenticate('local', {
    session: false,
    failureFlash: false
  }, function(err, user, info) {
    if (err) {
      return res.status(500).send();
    }
    if (user) {
      res.json(user);
    } else {
      res.status(401).json({error: 'invalidcredentials', message: 'Invalid username/password.'});
    }
  })(req, res, next);
});

var server = app.listen(process.env.PORT || 8080, function() {
  console.log('Server started.')
});


var dbServer = {
  uri: 'http://178.62.29.239:5984',
  adminUsername: 'admin',
  adminPassword: 'KtgFck3D557Sn545'
}

function calcDbFromUsername(username) {
  return 'userdb-' + new Buffer(username).toString('hex');
}

function authenticateUser(username, password, callback) {
  var db = calcDbFromUsername(username);
  request.get({
    uri: dbServer.uri + '/' + db,
    auth: {
      'user': username,
      'pass': password
    }
  }, function(err, response, body) {
    if (err) {
      return callback(e);
    }
    if (response.statusCode === 200) {
      callback(null, {username: username, db: db});
    } else if (response.statusCode === 401) {
      callback(null, false);
    } else {
      callback(new Error('Unknown error occurred while authenticating user'));
    }
  });
}

function createUser(username, password, callback) {
  var db = calcDbFromUsername(username);
  request.put({
    uri: dbServer.uri + '/' + db,
    auth: {
      'user': dbServer.adminUsername,
      'pass': dbServer.adminPassword
    },
    json: {
      "_id": "org.couchdb.user:dbreader",
      "name": username,
      "type": "user",
      "roles": [],
      "password": password
    }
  }, function(err, response, body) {
    if (err) {
      return callback(err);
    }
    if (response.statusCode === 201) {
      callback(null, {username: username, db: db});
    } else if (response.statusCode === 412) {
      callback(new Error('User already exists'));
    } else {
      callback(new Error('Unknown error occurred while creating user'));
    }
  });
}
