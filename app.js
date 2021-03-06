function findCoordinates(){
  var zipCode = document.getElementById('zip-input').value;
  var key = 'xxxxxxxxxxxxxxxxxxxxx';
  var query = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + zipCode + '&key=' + key;

  var xhr = new XMLHttpRequest();
  xhr.open('GET', query);
  xhr.send(null);

  xhr.onreadystatechange = function() {
    var DONE = 4;
    if (xhr.readyState === DONE) {
      if (xhr.status === 200) {
        var jsonResponse = JSON.parse(xhr.responseText);
        var city = jsonResponse.results[0].formatted_address;
        var latitude = jsonResponse.results[0].geometry.location.lat;
        var longitude = jsonResponse.results[0].geometry.location.lng;
        document.getElementsByTagName('h1')[0].textContent = city;

        getForecast(latitude, longitude);

      } else {
        console.log('Error: ' + xhr.status);
      }
    }
  }
}

function getForecast(lat, lng) {
  var forecastKey = 'xxxxxxxxxxxxxxxxxxxx';
  var script = document.createElement('script');
  script.src = 'https://api.forecast.io/forecast/' + forecastKey + '/' + lat + ',' + lng + '?callback=createForecastTables';

  document.head.appendChild(script);
}

function createForecastTables(data) {
  weekly(data);
  hourly(data);
  document.getElementById('week').style.backgroundColor = '#e6ecff';
  document.getElementById('today').style.backgroundColor = '#e6ecff';
}

function weekly(myData) {
  var weeklyForecast = ['<caption>Weekly Forecast</caption>', '<tr><th>Day</th><th>Temp (hi/low) <img class="header" src="img/f.svg"></th><th>Feels like (hi/low) <img class="header" src="img/f.svg"></th><th>Summary</th></tr>'];
  for (var i = 0; i < 7; i++) {
    var date = new Date(myData.daily.data[i].time*1000);
    var newLine = '<tr><td>' + date.toString().substring(0, 10) + "</td>";
    newLine += '<td>' + Math.round(myData.daily.data[i].temperatureMax)  + " / " +  Math.round(myData.daily.data[i].temperatureMin) + "</td>";
    newLine += '<td>' + Math.round(myData.daily.data[i].apparentTemperatureMax) + " / " + Math.round(myData.daily.data[i].apparentTemperatureMin) + "</td>";
    newLine += '<td>' + myData.daily.data[i].summary;
    newLine += '<img class="row" src="img/' + myData.daily.data[i].icon + '.svg"></td></tr>';
    weeklyForecast.push(newLine);
  }
  var HTMLstring = weeklyForecast.join('')
  document.getElementById('week').innerHTML = HTMLstring;
}

function hourly(myData) {
  var hourlyForecast = ['<caption>Next 12 Hours</caption>', '<tr><th>Time</th><th>Temp <img class="header" src="img/f.svg"></th><th>Feels like <img class="header" src="img/f.svg"></th><th>Summary</th></tr>'];
  for (var i = 0; i < 12; i++) {
    var date = new Date(myData.hourly.data[i].time*1000);
    var time = formatTime(date);
    var newLine = "<tr><td>" + time + "</td>";
    newLine += "<td>" + Math.round(myData.hourly.data[i].temperature) + "</td>";
    newLine += "<td>" + Math.round(myData.hourly.data[i].apparentTemperature) + "</td>";
    newLine += "<td>" + myData.hourly.data[i].summary;
    newLine += '<img class="row" src="img/' + myData.hourly.data[i].icon + '.svg"></td></tr>';
    hourlyForecast.push(newLine);
  }
  var HTMLstring = hourlyForecast.join('')
  document.getElementById('today').innerHTML = HTMLstring;
}

function formatTime(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
}
