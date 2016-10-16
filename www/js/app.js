// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller("ChartController",function(){
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDAnZwDIt-1Ld70ojW1vLEkXOuN0taGNwY",
    authDomain: "sensactio.firebaseapp.com",
    databaseURL: "https://sensactio.firebaseio.com",
    storageBucket: "sensactio.appspot.com",
    messagingSenderId: "63323373388"
  };
  firebase.initializeApp(config);

  var theData = firebase.database().ref('sensor_feed').limitToLast(100);

  theData.once('value', function(snapshot){
    sensor1 = [];
    sensor2 = [];
    sensor3 = [];

    snapshot.forEach(function(childSnapshot) {
      var childData = childSnapshot.val();
      
      childData.str_pressure = childData.str_pressure.replace("kPa","");
      var pressure = Number(childData.str_pressure);

      switch(childData.id){
        case '1':
          sensor1.push([childData.timestamp, pressure]);
          break;
        case '2':
          sensor2.push([childData.timestamp, pressure]);
          break;
        case '3':
          sensor3.push([childData.timestamp, pressure]);
          break;

        default:
          console.log("WTF? SHOULD BE IMPOSSIBLE");
      }
      
    });

    $('#container').highcharts({
          chart: {
              zoomType: 'x'
          },
          title: {
              text: 'Monthly Average Temperature',
              x: -20 //center
          },
          subtitle: {
              text: 'Source: WorldClimate.com',
              x: -20
          },
          
          xAxis: {
              type: 'datetime'
          },

          yAxis: {
              title: {
                  text: 'Pressure (kPa)'
              },
              plotLines: [{
                  value: 0,
                  width: 1,
                  color: '#808080'
              }]
          },
          tooltip: {
              valueSuffix: '°C'
          },
          legend: {
              layout: 'vertical',
              align: 'right',
              verticalAlign: 'middle',
              borderWidth: 0
          },
          series: [{
              name: 'Sensor 1',
              data: sensor1
          },{
              name: 'Sensor 2',
              data: sensor2
          },{
              name: 'Sensor 3',
              data: sensor3
          }]
      });
    })
})