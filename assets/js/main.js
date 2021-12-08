


function initMap(){

    if(!window.ffl_lon || !window.ffl_lat){
        window.ffl_lat = 37.2755586;
        window.ffl_lon = -104.6573965;
    }
    console.log(window.ffl_lon,window.ffl_lat)

    var map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: window.ffl_lat, lng: window.ffl_lon },
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        style : [{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#343e56"}]},{"featureType":"administrative","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#c3ccda"}]},{"featureType":"landscape","elementType":"labels.icon","stylers":[{"color":"#788aa3"}]},{"featureType":"landscape","elementType":"labels.text.fill","stylers":[{"color":"#343e56"}]},{"featureType":"landscape","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"geometry.fill","stylers":[{"color":"#c3ccda"}]},{"featureType":"poi","elementType":"labels.icon","stylers":[{"color":"#788aa3"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#343e56"}]},{"featureType":"poi","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#aeb9c8"}]},{"featureType":"road","elementType":"geometry.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#343e56"}]},{"featureType":"road","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.local","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"labels.icon","stylers":[{"color":"#788aa3"}]},{"featureType":"transit","elementType":"labels.text.fill","stylers":[{"color":"#343e56"}]},{"featureType":"transit","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"transit.line","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"geometry.fill","stylers":[{"color":"#788aa3"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"visibility":"simplified"}]}],
        icons: {
            house: "https://uploads-ssl.webflow.com/5ea979f1dcf900bb408004a2/5ebbe95142f17b488b2fb3ff_Pin.svg",
        }
    });



    loadMarkersAjax(map);

}

function getLocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);

    }
}

function showPosition(position) {
    window.ffl_lat = position.coords.latitude;
    window.ffl_lon = position.coords.longitude;
    initMap();
}

//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
function calcCrow(lat1, lon1, lat2, lon2)
{
    var R = 6371; // km
    var dLat = toRad(lat2-lat1);
    var dLon = toRad(lon2-lon1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d;
}

// Converts numeric degrees to radians
function toRad(Value)
{
    return Value * Math.PI / 180;
}

function getLocationZipCode(){
    var zipcode = jQuery('#enter_zipcode').val();
    if(zipcode && zipcode.toString().length === 5){
        var geocoder = new google.maps.Geocoder();
        var address = zipcode;
        geocoder.geocode({ 'address': 'zipcode '+address }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                window.ffl_lat = results[0].geometry.location.lat();
                window.ffl_lon = results[0].geometry.location.lng();
                console.log('Yeah', results[0].geometry.location.lat(), window.ffl_lat)
                initMap();
            } else {
                alert("Request failed.")
            }
        });

    }else{
        alert('Enter a valid zipcode')
    }
}

function loadMarkersAjax(map) {
    jQuery.ajax( {
        type: 'POST',
        url:  parameters.ajax_url,
        data:{
            'action':'get_ffl',
        },
        dataType: "json",
        beforeSend: function () {
            /*$(".wrpl_loader").css("display", "block");
            $("#modal-overlay").show();*/
        },
        complete: function () {
            /*$(".wrpl_loader").css("display", "none");
            $("#modal-overlay").hide();*/
        },
        success: function (response) {
            var locators = [];
            var markers = [];
            if(response.success){
                var bounds = new google.maps.LatLngBounds();
                var infoWindows = [];

                var infowindow = new google.maps.InfoWindow();
                var marker, i, bg_image;
                var x = 0;
                var l = [];
               
                //Empty the desaler list before being populated
                jQuery('#fll_dealer_list').empty();

                locators = response.locators;

                var ffl_locators = [];

                for (i = 0; i < locators.length; i++) {
                    var locator = locators[i];

                    var latitude = parseFloat(locator.lat);
                    var longitude = parseFloat(locator.lon);
                    if (latitude === 0 && longitude === 0) { l.push(locator.name); }

                    var distance = Math.round(calcCrow(latitude, longitude, window.ffl_lat,window.ffl_lon));
                    console.log(distance)

                    ffl_locators.push({
                        distance : distance,
                        address : locator.address,
                        city : locator.city,
                        zip : locator.zip,
                        certified : locator.certified,
                        name : locator.name,
                        phone : locator.phone,
                        state : locator.state,
                        lat : locator.lat,
                        lon : locator.lon,

                    });

                }

                ffl_locators.forEach((locator) => {

                    var latitude = parseFloat(locator.lat);
                    var longitude = parseFloat(locator.lon);

                    if ((latitude && longitude) && (latitude !== 0 && longitude !== 0)) {

                        infoWindows.push('<div  class="infowindow w-inline-block"><div class="results-image-wrap"></div><div class="map-card-text-wrap"><h4 class="dark-blue-text no-margin"><strong>'+locator.name+'</strong></h4><p>Distance: <strong>'+Math.round(distance)+'</strong> miles</p><p>'+locator.address+' ' + locator.city + ', '+locator.state+'</p><p><a href="tel:'+locator.phone+'">'+locator.phone+'</a> <a href="https://www.google.com/maps/search/?api=1&query='+ locator.address + '+' + locator.zip +'" target="_blank">Directions</a><p></p></div></div>');

                        marker = new google.maps.Marker({
                            position: new google.maps.LatLng(latitude, longitude),
                            animation: google.maps.Animation.DROP,
                            map: map,
                            icon: {
                                url: "https://uploads-ssl.webflow.com/5ea979f1dcf900bb408004a2/5ebbe95142f17b488b2fb3ff_Pin.svg",
                                scaledSize: new google.maps.Size(38, 38),
                                origin: new google.maps.Point(0, 0),
                                anchor: new google.maps.Point(14.5, 38)
                            },
                            title: 'asdasdasd'
                        });

                        google.maps.event.addListener(marker, 'click', (function(marker, x) {
                            return function() {
                                //map.setCenter(marker.getPosition());
                                infowindow.setContent(infoWindows[x]);
                                infowindow.open(map, marker);
                            }
                        })(marker, x));

                        markers.push(marker);
                        bounds.extend(marker.position);
                        x++;
                    }

                    var certified_markup = locator.certified ? '<img class="certified_img" src="'+parameters.plugin_url+'/assets/images/certified.png" alt=""><span><strong> CERTIFIED KGM DEALER </strong></span>' : '';

                    jQuery('#fll_dealer_list').append('<div class="dealer-list-item"><p><strong>'+ locator.name +'</strong></p>' +
                        '<p><strong>'+ locator.address +'</strong></p>' +
                        '<p><strong>' + locator.city + ', ' + locator.state + ' ' + locator.zip + '</strong></p><br>' +
                        '<p><strong>'+locator.phone+'</strong></p>' +
                        '<strong>DISTANCE: '+ locator.distance +'MI</strong><div class="right-info">'+certified_markup+'<button>CONTINUE</button></div></div>');
                });
            }


        },
        error : function(jqXHR, exception){
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            alert(msg);
        }

    } );
}

