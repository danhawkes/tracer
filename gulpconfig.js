// These configure where the app looks for the login/registration services.
module.exports = [
  {pattern: 'CONFIG_WEB_PROTOCOL', replacement: process.env.WEB_PROTOCOL || 'http'},
  {pattern: 'CONFIG_WEB_HOST', replacement: process.env.WEB_HOST || 'tracer.arcs.co'},
  {pattern: 'CONFIG_WEB_PORT', replacement: process.env.WEB_PORT || '80'}
];
