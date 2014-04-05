/**
 * Created by deemadden on 10/21/13.
 */
var globals = {};

var tests = [];
for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    if (/Spec\.js$/.test(file)) {
      tests.push(file);
    }
  }
}

require.config({
  //By default load any module IDs from scavhnapp
  baseUrl: '/base/scavhnapp',

  //otherwise load it from the resources directory.
  //paths config is relative to the baseUrl, and
  //never includes a ".js" extension since
  //the paths config could be for a directory.
  paths: {
    'resources': '../resources',
    'text': '../resources/js/plugins/text'
  },

  /*
   An array of dependencies to load. Useful when require is defined as a config object before require.js is loaded,
   and you want to specify dependencies to load as soon as require() is defined.
   Using deps is just like doing a require([]) call, but done as soon as the loader has processed the configuration.
   It does not block any other require() calls from starting their requests for modules,
   it is just a way to specify some modules to load asynchronously as part of a config block.
   */
  deps: tests,

  callback: window.__karma__.start
});