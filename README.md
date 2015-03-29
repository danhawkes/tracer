# tracer-app

The client-side web-app.

## Building

`npm install` installs the required dependencies (including gulp and bower), and creates a build in the `build` directory.

To work on the code, you may want to install compatible versions of gulp and bower globally; the relevant versions are listed in `package.json`.

### Gulp configuration

`clean` - wipe out the build directory  
`build` - clean, build  
`serve` - clean, build, and serve the output using a static server

The build can be configured using environment variables in `gulpconfig.json`.
