define(
  
  'helpers/DateFormatter',
  
  [ ],
  
  function()
  {
    return {
      
      /**
       *  Given some sort of date (a Date object or a string like 2012-12-03), return a string formatted and localized based on the format passed in
       *  @param date If a string, it should be something like YYYY-MM-DD. Otherwise it should be a Date instance
       *  @param format A PHP-style date format, supporting MjgGiAJ
       *  @param utc A Boolean to indicate whether UTC should be appended.  Default is true. 
       *  @return A localized string formatted according to format
       */
      formatDate: function(date, format, utc)
      {

        if (typeof utc === 'undefined') 
        {
          utc = true;
        }

        if (typeof date == 'string')
          date = this.splitSimpleDate(date, utc);
        
        var out = [],
            fields = this.fieldsForDate(date); 

        for (var i=0; i<format.length; i++)
        {
          out.push(fields[format[i]] ? fields[format[i]]() : format[i]);
        }
        
        return out.join('');
      },

      fieldsForDate: function(date) {
        var self = this;

        return {
              F: function() { return self.longMonthForDate(date); },
              M: function() { return self.monthForDate(date); },
              m: function() { return (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1; },
              j: function() { return self.dayForDate(date); },
              g: function() { return date.getHours() % 12 },
              G: function() { return date.getHours() },
              i: function() { return (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()); },
              A: function() { return date.getHours() < 12 ? 'AM' : 'PM'; },
              a: function() { return date.getHours() < 12 ? 'am' : 'pm'; },
              J: function() { return (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()); },
              Y: function() { return date.getFullYear(); }
        };
      },

      splitSimpleDate: function(dateStr, utc)
      {
        if (typeof utc === 'undefined') 
        {
          utc = true;
        }

        var d = dateStr.replace(/\-/g, '/');
        //remove milliseconds
        d = d.replace(/\.\d\d?\d?/g, '');
        
        // If we didn't get a timezone, append UTC, which both backends send by default, so the date gets converted to local time
        if(d.search(/ [A-Za-z]{3}$/) == -1 && utc)
          d += ' UTC';
        
        return new Date(d);
      },

      longMonthForDate: function(date) {
        return date.getMonth();
      },

      monthForDate: function(date) {
        return date.getMonth();
      },

      dayForDate: function(date) {
        return date.getDate();
      }
    };
  }
  
);
