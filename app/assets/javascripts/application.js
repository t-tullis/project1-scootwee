// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require rails-ujs
//= require turbolinks
//= require jquery
//= require jquery_ujs
//= require bootstrap.min
var directionsService = new google.maps.DirectionsService
var directionsDisplay = new google.maps.DirectionsRenderer
var icon = new google.maps.MarkerImage("http://maps.google.com/mapfiles/ms/micons/blue.png",
 new google.maps.Size(32, 32), new google.maps.Point(0, 0),
 new google.maps.Point(16, 32));
var map_id;
var login;
var map;
var show;
var markers=[];
var center;

$(document).on('turbolinks:load',function(){
  function get_current_location(){

     if (navigator.geolocation) {
       getposition= function(position){
         $('input[name="lat"]').val(position.coords.latitude);
           $('input[name="lng"]').val(position.coords.longitude);
       }

        navigator.geolocation.getCurrentPosition(getposition);
        }
    else {
      alert('GEO LOCATION NOT SUPPORTED');
    }

   }
   function get_current_location_sign_up(){

      if (navigator.geolocation) {
        getposition= function(position){
          $('input[name="user[lat]"]').val(position.coords.latitude);
            $('input[name="user[lng]"]').val(position.coords.longitude);
        }

         navigator.geolocation.getCurrentPosition(getposition);
         }
     else {
       alert('GEO LOCATION NOT SUPPORTED');
     }

    }

  function map(){
    var list=$('#list');
    var bounds = new google.maps.LatLngBounds();
      var x=document.cookie.split(';');

      var lat = x[0].split('=')
      var lng= x[1].split('=')


    $.ajax({
        url: '/map',
        method: 'GET',
        success: function(data){
          map = new google.maps.Map(map_id, {
            center:{lat: parseFloat(lat[1]),lng: parseFloat(lng[1])},
            zoom:12.5    });
          center =new google.maps.Marker({
            position:{lat: parseFloat(lat[1]),lng: parseFloat(lng[1])},
            map:map,
            title:'Your actual position'
          });
            directionsDisplay.setMap(map);
          data.data.forEach(function(el,index){
            var pt = new google.maps.LatLng( el.lat, el.lng);
            console.log(el)
            bounds.extend(pt);
            // console.log(pt.getLatitude())
            marker=new google.maps.Marker({
              position:pt,
              map:map,
              icon:icon,
              title:el.name
            })
            markers.push(marker)
            list.append(`<p>name: ${el.name} Adress: ${el.street} ${el.city} ${el.state} ${el.zip_code} distance:${Math.round(el.distance)} miles <a class='display_road' data-id=${index}>show</a></p>`)
          });
          $('a').on('click',function(e){
            var i=$(this).attr('data-id')
            markers.forEach(function(mk){
              mk.setVisible(true);
            });
          center.setVisible(false)
          markers[i].setVisible(false)
          directionsService.route({
    origin: center.getPosition(),
    destination: markers[i].getPosition(),
    unitSystem: google.maps.DirectionsUnitSystem.METRIC,
    travelMode: google.maps.DirectionsTravelMode.WALKING
    }, function(result, status){
    if (status == google.maps.DirectionsStatus.OK){
    directionsDisplay.setDirections(result);
    }
    });
        });
        },
        error: function(data){
          console.log('error')
          console.log(data)}
        });


  }
  map_id=document.getElementById('map');
  login=document.getElementById('login');
  sign_up=document.getElementById('signup');
  if(login ){
  get_current_location();}
  if(sign_up ){
  get_current_location_sign_up();}
  if(map_id){
  map();

}

});
