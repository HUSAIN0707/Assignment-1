// Weather API sample javascript code
// Requires: jQuery and crypto-js (v3.1.9)
// 
// Copyright 2019 Oath Inc. Licensed under the terms of the zLib license see https://opensource.org/licenses/Zlib for terms.

var url = 'https://weather-ydn-yql.media.yahoo.com/forecastrss';
var method = 'GET';
var app_id = 'Q71dsJ4e';
var consumer_key = 'dj0yJmk9SU52WE15cFQ1TWJHJmQ9WVdrOVVUY3haSE5LTkdVbWNHbzlNQT09JnM9Y29uc3VtZXJzZWNyZXQmc3Y9MCZ4PWI1';
var consumer_secret = '8dc3dbe6c18783f77caff1a3fbf01e9acf3a52be';
var concat = '&';
var query = {'location': 'sunnyvale,USA', 'format': 'json'};
var oauth = {
    'oauth_consumer_key': consumer_key,
    'oauth_nonce': Math.random().toString(36).substring(2),
    'oauth_signature_method': 'HMAC-SHA1',
    'oauth_timestamp': parseInt(new Date().getTime() / 1000).toString(),
    'oauth_version': '1.0'
};

var merged = {}; 
$.extend(merged, query, oauth);
// Note the sorting here is required
var merged_arr = Object.keys(merged).sort().map(function(k) {
  return [k + '=' + encodeURIComponent(merged[k])];
});
var signature_base_str = method
  + concat + encodeURIComponent(url)
  + concat + encodeURIComponent(merged_arr.join(concat));

var composite_key = encodeURIComponent(consumer_secret) + concat;
var hash = CryptoJS.HmacSHA1(signature_base_str, composite_key);
var signature = hash.toString(CryptoJS.enc.Base64);

oauth['oauth_signature'] = signature;
var auth_header = 'OAuth ' + Object.keys(oauth).map(function(k) {
  return [k + '="' + oauth[k] + '"'];
}).join(',');

$.ajax({
  url: url + '?' + $.param(query),
  headers: {
    'Authorization': auth_header,
    'X-Yahoo-App-Id': app_id 
  },
  method: 'GET',
  success: function(data){
    console.log(data.forecasts[0].day)
    $(".location").html(data.location.city+", "+data.location.country)
    var img = ""
  if(data.forecasts[0].text.toLowerCase()=="rain")
      img = "images/8.png"
  else if(data.forecasts[0].text.toLowerCase()=="showers")
      img = "images/9.png"
  else if(data.forecasts[0].text.toLowerCase()=="scattered showers")
      img = "images/10.png"
  else if(data.forecasts[0].text.toLowerCase()=="sunny")
      img = "images/sunny.png"
  else if(data.forecasts[0].text.toLowerCase()=="mostly sunny")
      img = "images/couldy-sunny.png"
    else if(data.forecasts[0].text.toLowerCase()=="partly cloudy")
      img = "images/couldy-sunny.png"
  
    $('#img').attr("src",img)
    $('#high').html(data.forecasts[0].high)
    $('#low').html(data.forecasts[0].low)
    $('.conditions').html(data.forecasts[0].text)
    $('.ext').html("Wind Speed : "+data.current_observation.wind.speed+" <br>Humidity : "+data.current_observation.atmosphere.humidity+" <br>Pressure : "+data.current_observation.atmosphere.pressure+" <br>Sunrise/Sunset Time : "+data.current_observation.astronomy.sunrise+"/"+data.current_observation.astronomy.sunset)
    var date = $.parseJSON('{"date_created":"'+data.forecasts[0].date+'"}'),
    myDate = new Date(1000*date.date_created);

var days = []
var high_temp=[]
var low_temp=[]
for(i=0; i<data.forecasts.length; i++){
  var img = ""
  days[i]=data.forecasts[i].day
  high_temp[i]=data.forecasts[i].high
  low_temp[i]=data.forecasts[i].low
  if(data.forecasts[i].text.toLowerCase()=="rain")
      img = "images/8.png"
  else if(data.forecasts[i].text.toLowerCase()=="showers")
      img = "images/9.png"
  else if(data.forecasts[i].text.toLowerCase()=="scattered showers")
      img = "images/10.png"
  else if(data.forecasts[i].text.toLowerCase()=="sunny")
      img = "images/sunny.png"
  else if(data.forecasts[i].text.toLowerCase()=="mostly sunny")
      img = "images/couldy-sunny.png"
    else if(data.forecasts[i].text.toLowerCase()=="partly cloudy")
      img = "images/couldy-sunny.png"
    var date = $.parseJSON('{"date_created":"'+data.forecasts[i].date+'"}'),
    myDate = new Date(1000*date.date_created);
  $('#future').html($('#future').html()+'<div class="container"><h3 class="day">'+data.forecasts[i].day+'</h3><br>'+myDate.toLocaleString()+'<div class="weatherIcon"><img src='+img+'></div><p class="conditions">'+data.forecasts[i].text+'</p><p class="tempRange"><span class="high">'+data.forecasts[i].high+'</span> | <span class="low">'+data.forecasts[i].low+'</span></p></div>')
}
var lineChartData = {
      labels: days,
      datasets: [{
        label: 'low temperature',
        borderColor: "#FF6384",
        backgroundColor: "#FF6384",
        fill: false,
        data: low_temp,
        yAxisID: 'y-axis-1',
      }, {
        label: 'high temperature',
        borderColor:"#007BFF",
        backgroundColor: "#007BFF",
        fill: false,
        data: high_temp,
        yAxisID: 'y-axis-2'
      }]
    };
window.onload = function() {

var ctx = $('#myChart');
  // var ctx = document.getElementById('myChart');
var myLineChart = new Chart(ctx, {
    type: 'line',
    data: lineChartData,
    options: {
      
          responsive: true,
          hoverMode: 'index',
          stacked: false,
          title: {
            display: true,
            text: 'weather temperature chart'
          },
          scales: {
            yAxes: [{
              type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
              display: true,
              position: 'left',
              id: 'y-axis-1',
            }, {
              type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
              display: true,
              position: 'right',
              id: 'y-axis-2',

              // grid line settings
              gridLines: {
                drawOnChartArea: true, // only want the grid lines for one axis to show up
              },
            }],
          }
        }
});
}
    $(".date").html(data.forecasts[0].day+", "+ myDate.toLocaleString())
    console.log(data);
  }
});
$('#cd').click(function(){
  $('#chartDiv').slideUp()
  $('#future').slideDown()
})
$('#cv').click(function(){
  $('#future').slideUp()
  $('#chartDiv').slideDown()
})
$('#md').click(function(){
  $('#ld').show()
  $('#md').hide()
  $('.ext').slideToggle()
})
$('#ld').click(function(){
  $('#md').show()
  $('#ld').hide()
  $('.ext').slideToggle()
})
