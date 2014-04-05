define(

  'utils/Debug',

  [ ],

  function()
  {
    return {

      logging: true,

      /**
       *  Use Debug.log instead of console.log, so we can turn off app-wide logging easily
       *  Credit: http://patik.com/blog/complete-cross-browser-console-log/
       */
      log: function()
      {
        // Enable log or not
        if (!this.logging){
          return;
        }
 
        // Tell IE9 to use its built-in console
        if (Function.prototype.bind && (typeof console === 'object' || typeof console === 'function') && typeof console.log == "object") {
          ["log","info","warn","error","assert","dir","clear","profile","profileEnd"]
            .forEach(function (method) {
              console[method] = this.call(console[method], console);
            }, Function.prototype.bind);
        }
        // Modern browsers
        if (typeof console != 'undefined' && typeof console.log == 'function') {

          // Opera 11
          if (window.opera) {
            var i = 0;
            while (i < arguments.length) {
              console.log("Item " + (i+1) + ": " + arguments[i]);
              i++;
            }
          }

          // All other modern browsers
          // else if ((Array.prototype.slice.call(arguments)).length == 1 && typeof Array.prototype.slice.call(arguments)[0] == 'string')
          // {
          //   console.log( (Array.prototype.slice.call(arguments)).toString() );
          // }
          else
          {
            //console.log( Array.prototype.slice.call(arguments) );
            var app_console = _.bind(console.log, console);
            app_console.apply(console, arguments);
          }
        }
      },

      /**
       * Basic timing operations.
       *
       * We can start to instrument different parts of the app.
       * and create graphs with performance related points.
       */
      timingEnabled: false,

      timing: [],

      /**
       * Used to measure the time spent executing an operation.
       */
      time: function(id)
      {
        if(this.timingEnabled)
          this.timing[CryptoJS.MD5(id)] = new Date();
      },

      /**
       * Marks the end of a measurement. 
       */
      timeEnd: function(id)
      {
        var index = CryptoJS.MD5(id);
        
        if(this.timing[index] && this.timingEnabled)
        {
          this.log('[timing]', id, new Date() - this.timing[index], 'ms' );
        }
      }
    };
  }

);