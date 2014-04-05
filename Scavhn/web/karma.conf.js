// Karma configuration
// Generated on Fri Oct 18 2013 17:37:32 GMT-0700 (PDT)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    // basePath: '',

    // frameworks to use
    frameworks: ['jasmine', 'requirejs'],

    // list of files / patterns to load in the browser
    files: [
      {pattern: 'scavhnapp/partials/*.html', included: false},
      'resources/js/lib/crypto-js-3.1.2/core-min.js',
      'resources/js/lib/crypto-js-3.1.2/md5-min.js',
      'resources/js/lib/modernizr-2.7.1.min.js',
      'resources/js/lib/jquery-2.0.3.min.js',
      'resources/js/lib/underscore-1.5.2.min.js',
      'resources/js/lib/backbone-1.1.0.min.js',
      'resources/js/lib/sinon-1.8.1.js',
      'spec/TestHelper.js',
      {pattern: 'resources/js/plugins/text.js', included: false},
      {pattern: 'scavhnapp/settings.js', included: false},
      {pattern: 'scavhnapp/App.js', included: false},
      {pattern: 'scavhnapp/utils/Debug.js', included: false},
      {pattern: 'scavhnapp/services/*.js', included: false},
      {pattern: 'scavhnapp/helpers/*.js', included: false},
      {pattern: 'scavhnapp/mediator/*.js', included: false},
      {pattern: 'scavhnapp/models/*.js', included: false},
      {pattern: 'scavhnapp/viewmodels/*.js', included: false},
      {pattern: 'scavhnapp/views/*.js', included: false},
      {pattern: 'spec/ServicesManagerIntegrationSpec.js', included: false},
      {pattern: 'spec/ServicesManagerUnitSpec.js', included: false},
      {pattern: 'spec/ScavUnitSpec.js', included: false},
      {pattern: 'spec/ScavCollectionUnitSpec.js', included: false},
      {pattern: 'spec/ServicesAdapterUnitSpec.js', included: false},
      {pattern: 'spec/HomeScreenViewModelUnitSpec.js', included: false},
      {pattern: 'spec/HomeScreenViewUnitSpec.js', included: false},
      {pattern: 'spec/ScavItemsViewModelUnitSpec.js', included: false},
      'spec/test-main.js'
    ],

    // list of files to exclude
    exclude: [ ],

    preprocessors: { },

    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
