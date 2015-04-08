// These configure where the app looks for the login/registration services.
module.exports = [
  {pattern: 'CONFIG_WEB_URL', replacement: process.env.WEB_URL || 'http://tracer.arcs.co'}
];
