/**
*Copyleft (c) 2014, "The BeardTeam" - https://github.com/BeardTeam/
*
*This file (openhours.js) is part of ipc-d3,
*	and developed by Massimiliano Leone
*	<maximilianus@gmail.com> - http://plus.google.com/+MassimilianoLeone
* 	as part of https://github.com/BeardTeam/opendata-experiments
*
*    openhours.js is free software: you can redistribute it and/or modify
*    it under the terms of the GNU General Public License as published by
*    the Free Software Foundation, either version 3 of the License, or
*    (at your option) any later version.
*
*    openhours.js is distributed in the hope that it will be useful,
*    but WITHOUT ANY WARRANTY; without even the implied warranty of
*    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*    GNU General Public License for more details.
*
*    You should have received a copy of the GNU General Public License
*    along with .  If not, see <http://www.gnu.org/licenses/>.
 ******************************************************************************/

// formerly helpers.js

var helpers = {
  rangeToDays: function(startDay, endDay) {
    var week = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    var days = [];

    var i, open = false;
      // loops twice just in case of a Sun-Thu schedule
    for(i=0; i<week.length*2; i++) {
      if(week[i%7] === startDay) { open = true; }
      if(open) { days.push(week[i%7]); }
      if(week[i%7] === endDay && open === true) { break; }
    }

    return days;
  },

    // converts time from 12-hour string into a 24-hr decimal
    //  midnight on the dot is treated as 24, but 12:15am is 0.25
  to24Hr: function(twelveHour) {
    var hoursRegex = /\d*/;
    var eveningRegex = /pm/i;

    var time = twelveHour.split(':');
    var hours = parseInt(hoursRegex.exec(time[0])[0], 10);

    if(eveningRegex.test(twelveHour) && hours < 12) {
      hours += 12;
    } else if (!eveningRegex.test(twelveHour) && hours === 12) {
      if(!time[1] || parseInt(time[1], 10) === 0) {
        hours = 24;
      } else {
        hours -= 12;
      }
    }

    if(time[1]) {
      hours += parseInt(time[1], 10)/60;
    }

    return hours;
  },

  to12Hr: function(twentyfour) {
    twentyfour = parseFloat(twentyfour);

    var min = Math.floor((twentyfour % 1) * 60);
    if(min === 0) {
      min = '';
    } else {
      min = min + '';
      min = (min.length<2) ? ':0'+ min : ':'+ min;
    }

    var hr = Math.floor(twentyfour);
    if(hr === 0 || hr === 24) {
      hr = '12'+ min +' am';
    } else if(hr === 12) {
      hr = '12'+ min +' pm';
    } else if(hr > 12) {
        hr = hr%12 + min +' pm';
    } else {
      hr = hr + min +' am';
    }

    return hr;
  },

    // since the schedule considers early morning hours as the previous
    //  day, I've set 5am as the cutoff. times between midnight and 5am
    //  will reference the previous day's schedule
  _cutoff: 5,

  getDay: function(dateObj) {
    var weekday = {
      0: 'Sun',
      1: 'Mon',
      2: 'Tue',
      3: 'Wed',
      4: 'Thu',
      5: 'Fri',
      6: 'Sat'
    };

    var hour = parseInt(dateObj.getHours(), 10);
    var day = weekday[dateObj.getDay()];

    if(hour < helpers._cutoff) {
      day = (day === 'Sun') ? 'Sat' : weekday[dateObj.getDay()-1];
    }

    return day;
  },

  getTime: function(dateObj) {
    var time = parseInt(dateObj.getHours(), 10);
    time += parseFloat(dateObj.getMinutes()/60);
    return time;
  }
};

var makeSchedule = function(rawSchedule) {
  var schedule = init(rawSchedule);

  function _parseHours(rawHours) {
    var hoursRegex = /\d*:*\d+ [ap]m - \d*:*\d+ [ap]m/;
    var openclose = rawHours.match(hoursRegex)[0].split(' - ');
    openclose[0] = helpers.to24Hr(openclose[0]);
    openclose[1] = helpers.to24Hr(openclose[1]);

    return openclose;
  }

  function _parseDays(rawDays) {
    var openDays = [];     // array of days sharing the same schedule

    var dayRangeRegex = /[a-z]{3}-[a-z]{3}/i;
    if(rawDays.match(dayRangeRegex) && rawDays.match(dayRangeRegex).length > 0) {
      var dayRange = rawDays.match(dayRangeRegex)[0].split('-');
      openDays = helpers.rangeToDays(dayRange[0], dayRange[1]);
    }

    var singleDaysRegex = /([a-zA-Z]{3})/g;
    var singleDays = rawDays.match(singleDaysRegex);

    _.each(singleDays, function(day) {
      openDays.push(day);
    });

    return openDays;
  }

  function init(rawSched) {
    var parsed = {};
    var scheds = rawSched.split('/');
    _.each(scheds, function(sched) {
      sched = sched.trim();

      var openclose = _parseHours(sched);
      var days = _parseDays(sched);

      _.each(days, function(day){
        parsed[day] = {};
        parsed[day].open = openclose[0];
        parsed[day].close = openclose[1];
      });
    });
    return parsed;
  }

  return schedule;
};

// formerly place.js

  // wrote in pseudo-classical style since I didn't want all instances
  // of Place to have their own instance of isOpen
var Place = function(name, rawHours) {
  this.name = name;
  this.schedule = makeSchedule(rawHours);
};

  // returns true if it's open for the time, false if not
Place.prototype.isOpen = function(dateObj) {
  var time = helpers.getTime(dateObj);
  var day = helpers.getDay(dateObj);

  if(typeof this.schedule[day] === 'undefined') { return false; }
  var open = this.schedule[day].open;
  var close = this.schedule[day].close;

  if(open < close && open <= time && time < close) {
    return true;
  } else if(open > close) {     // if it rolls over to the next day (e.g. 1800 - 0200)
    if( (open <= time && time <= 24) || (0 <= time && time < close) ) {
      return true;
    }
  }
  return false;
};

var parseCsvMaker = function() {
  var cache = {};

  return function(filename, callback) {
    if(cache[filename]) {
      return (callback) ? callback(cache[filename]) : cache[filename];
    } else {
      d3.text(filename, function(err, csvData) {
        var data = d3.csv.parseRows(csvData);
        var places = [];

        for(var i=0; i<data.length; i++) {
          var rest = new Place(data[i][0], data[i][1]);
          places.push(rest);
        }

        cache[filename] = places;
        
        return (callback) ? callback(places) : places;
      });
    };
  };
};

var parseCSV = parseCsvMaker();

var find_open_places = function(csv_filepath, dateObj, callback) {
  parseCSV(csv_filepath, function(places) {
    var openSpots = [];
    var day = helpers.getDay(dateObj);
    var spot = {};
    for(var i=0; i<places.length; i++) {
      if(places[i].isOpen(dateObj)) {
        spot = {
          name: places[i].name,
          open: places[i].schedule[day].open,
          close: places[i].schedule[day].close
        };
        if(spot.close < helpers._cutoff) {
          spot.close += 24;     // modified data for D3.. really should be on D3 end
        }
        openSpots.push(spot);
      }
    }
    openSpots = _.sortBy(openSpots, function(spot) {
      return spot.name;
    });
    return (callback) ? callback(openSpots) : openSpots;
  });
};
