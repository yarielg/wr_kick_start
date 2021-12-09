(function(window, $) {
    "use strict";

    function MapHandler(){
        var self = this;

        self.init();
    }

    MapHandler.prototype = {

        init: function () {
            var self = this;
            var map = null;

            self.preventingPlaceOrder();
        },
        initMap(){
            var self = this;
            if(!window.ffl_lon || !window.ffl_lat){
                window.ffl_lat = 37.2755586;
                window.ffl_lon = -104.6573965;
            }

            console.log(document.getElementById("map_id_wrapper"))

            self.map = new google.maps.Map(document.getElementById("map_id_wrapper"), {
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

            self.loadMarkersAjax(self.map);
        },
        loadMarkersAjax(map) {
            var self = this;
            $.ajax( {
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
                        $('#fll_dealer_list').empty();

                        locators = response.locators;

                        var ffl_locators = [];

                        for (i = 0; i < locators.length; i++) {
                            var locator = locators[i];

                            var latitude = parseFloat(locator.lat);
                            var longitude = parseFloat(locator.lon);
                            if (latitude === 0 && longitude === 0) { l.push(locator.name); }

                            var distance = Math.round(self.calcCrow(latitude, longitude, window.ffl_lat,window.ffl_lon));

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
                                id : locator.id,

                            });
                        }

                        ffl_locators.forEach((locator) => {

                            var latitude = parseFloat(locator.lat);
                            var longitude = parseFloat(locator.lon);

                            if ((latitude && longitude) && (latitude !== 0 && longitude !== 0)) {
                                infoWindows.push('<div  class="infowindow w-inline-block">' +
                                    '<div class="results-image-wrap">' +
                                        '</div>' +
                                            '<div class="map-card-text-wrap">' +
                                                '<h4 class="dark-blue-text no-margin"><strong>'+locator.name+'</strong></h4>' +
                                                '<p>Distance: <strong>'+Math.round(distance)+'</strong> miles</p>' +
                                                '<p>'+locator.address+' ' + locator.city + ', '+locator.state+'</p>' +
                                                '<p><a href="tel:'+locator.phone+'">'+locator.phone+'</a> <a href="https://www.google.com/maps/search/?api=1&query='+ locator.address + '+' + locator.zip +'" target="_blank">Directions</a></p>' +
                                                '<p><label for="btn-dealer-'+locator.id+'">Select & Continue</label></p>'+
                                        '</div>' +
                                    '</div>');
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

                            $('#fll_dealer_list').append('<div class="dealer-list-item"><p><strong>'+ locator.name +'</strong></p>' +
                                '<p><strong>'+ locator.address +'</strong></p>' +
                                '<p><strong>' + locator.city + ', ' + locator.state + ' ' + locator.zip + '</strong></p><br>' +
                                '<p><strong>'+locator.phone+'</strong></p>' +
                                '<strong>DISTANCE: '+ locator.distance +'MI</strong><div class="right-info">'+certified_markup+'<input data-dealer="'+window.btoa(JSON.stringify(locator))+'" type="radio" name="dealer_selection" required class="continue btn-step radio-dealer btn-dealer-'+locator.id+'" id="btn-dealer-'+locator.id+'"><label for="btn-dealer-'+locator.id+'">Select & Continue</label></div></div>');
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

            });
        },
        getLocation(){
            var self = this;
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(self.showPosition);
            }
        },
        showPosition(position) {
            window.ffl_lat = position.coords.latitude;
            window.ffl_lon = position.coords.longitude;
            window.Kgm.MapHandler.initMap();
        },
        calcCrow(lat1, lon1, lat2, lon2)
        {
            var self = this;
            var R = 6371;
            var dLat = self.toRad(lat2-lat1);
            var dLon = self.toRad(lon2-lon1);
            var lat1 = self.toRad(lat1);
            var lat2 = self.toRad(lat2);

            var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            var d = R * c;
            return d;
        },
        toRad(value)
        {
            return value * Math.PI / 180;
        },
        getLocationZipCode(){
            var self = this;
            var zipcode = $('#enter_zipcode').val();
            if(zipcode && zipcode.toString().length === 5){
                var geocoder = new google.maps.Geocoder();
                var address = zipcode;
                geocoder.geocode({ 'address': 'zipcode '+address }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        window.ffl_lat = results[0].geometry.location.lat();
                        window.ffl_lon = results[0].geometry.location.lng();
                        console.log('Yeah', results[0].geometry.location.lat(), window.ffl_lat)
                        self.initMap();
                    } else {
                        alert("Request failed.")
                    }
                });

            }else{
                alert('Enter a valid zipcode')
            }
        },
        generateClick(id) {
            $(".btn-dealer-"+id).trigger('click');
        },
        preventingPlaceOrder(){
            $(window).keydown(function(event){
                if(event.keyCode == 13) {
                    event.preventDefault();
                    return false;
                }
            });
        },
        addressComponent(address_component){
            var country = '';
            var zip = '';
            var street_number = '';
            var route = '';
            var state = '';
            var city = '';
            address_component.forEach(function(component){
                switch (component.types[0]) {
                    case 'street_number':
                        street_number = component.long_name;
                        break;
                    case 'route':
                        route = component.long_name;
                        break;
                    case 'administrative_area_level_1':
                        state = component.short_name;
                        break;
                    case 'postal_code':
                        zip = component.short_name;
                        break;
                    case 'country':
                        country = component.short_name;
                        break;
                    case 'locality':
                        city = component.short_name;
                        break;
                    case 'neighborhood':
                        city = component.short_name;
                        break;
                }
            });

            return { address: street_number + ' ' + route, city:city, state: state, zip:zip, country:country }
        },
        cleanFields(){
            $('#txt_dealer_country').val('');
            $('#txt_dealer_state').val('');
            $('#txt_dealer_city').val('');
            $('#txt_dealer_zip').val('');
            $('#txt_dealer_lat').val('');
            $('#txt_dealer_lon').val('');
            $('#txt_dealer_name').val('');
            $('#txt_dealer_phone').val('');
            $('#txt_dealer_address').val('');
            $('#txt_dealer_location').val('');
        },
        initAddressAuto(){
            var places = new google.maps.places.Autocomplete(document.getElementById('txt_dealer_location'));
            google.maps.event.addListener(places, 'place_changed', function () {
                var place = places.getPlace();
                var address = place.formatted_address;
                var latitude = place.geometry.location.lat();
                var longitude = place.geometry.location.lng();
                var latlng = new google.maps.LatLng(latitude, longitude);
                var geocoder = new google.maps.Geocoder();
                geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {

                        if (results[0]) {
                            console.log(results[0]);
                            var address_obj = window.Kgm.MapHandler.addressComponent(results[0].address_components);
                            var address = address_obj.address;
                            var zip = address_obj.zip;
                            var country = address_obj.country;
                            var state = address_obj.state;
                            var city = address_obj.city;
                            document.getElementById('txt_dealer_country').value = country;
                            document.getElementById('txt_dealer_state').value = state;
                            document.getElementById('txt_dealer_city').value = city;
                            document.getElementById('txt_dealer_zip').value = zip;
                            document.getElementById('txt_dealer_lat').value = latitude;
                            document.getElementById('txt_dealer_lon').value = longitude;
                            document.getElementById('txt_dealer_address').value = address;
                        }
                    }
                });
            });
        },
        toggleMap(){
            $('.dealer_selection_radio').on('click', function(){
                if($(this).hasClass('choose')){
                    $('.enter_your_dealer').css('display','none');
                    $('.dealer_selection').css('display','block');
                }else{
                    $('.enter_your_dealer').css('display','block');
                    $('.dealer_selection').css('display','none');
                }

            });
        },
        checkDealerFields(){
            return $('#txt_dealer_country').val().length !== 0 &&
                   $('#txt_dealer_state').val().length !== 0 &&
                   //$('#txt_dealer_city').val().length !== 0 &&
                   $('#txt_dealer_zip').val().length !== 0 &&
                   //$('#txt_dealer_lat').val().length !== 0 &&
                   //$('#txt_dealer_lon').val().length !== 0 &&
                   $('#txt_dealer_name').val().length !== 0 &&
                   $('#txt_dealer_address').val().length !== 0 &&
                   $('#txt_dealer_phone').val().length !== 0;
        },
        processAddDealer(){
            $('#btn_enter_location').on('click', function(){
                var self = this;
                var country =  $('#txt_dealer_country').val();
                var state =  $('#txt_dealer_state').val();
                var city =  $('#txt_dealer_city').val();
                var zip =  $('#txt_dealer_zip').val();
                var lat =  $('#txt_dealer_lat').val();
                var lon =  $('#txt_dealer_lon').val();
                var name =  $('#txt_dealer_name').val();
                var phone =  $('#txt_dealer_phone').val();
                var address =  $('#txt_dealer_address').val();
                if(window.Kgm.MapHandler.checkDealerFields()){
                    $.ajax( {
                        type: 'POST',
                        url:  parameters.ajax_url,
                        data:{
                            'action':'add_ffl',
                            'country': country,
                            'state': state,
                            'city': city,
                            'zip': zip,
                            'lat': lat,
                            'lon': lon,
                            'name': name,
                            'phone': phone,
                            'address': address
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
                            if(response.success){
                                $('#dealer_info_selected').empty();
                                $('#dealer_info_selected').append('<h4><strong>SELECTED FFL</strong></h4>\n' +
                                    '    <p><strong>'+name+'</strong></p>\n' +
                                    '    <p><strong>'+address+'</strong></p>\n' +
                                    '    <p><strong>'+ city + ', ' + state + ' ' + zip + '</strong></p>\n' +
                                    '    <p><strong><a href="tel:'+phone+'">'+phone+'</a></strong></p>');

                                window.Kgm.MapHandler.cleanFields();
                                /*window.Kgm.CheckoutHandler.changeStep(1);
                                window.Kgm.CheckoutHandler.displaySteps();
                                window.Kgm.CheckoutHandler.stepBarUpdate();*/
                                $('.continue').filter('.footer').css('display','inline-block');
                                $('.enter_your_dealer').css('display','none');
                                $('#enter_dealer_msg_success').css('display','block');
                            }else{
                                alert('we could not add the dealer');
                            }
                        }
                    });
                }else{
                    alert('There are some errors');
                }

            });
        }
    }

    window.Kgm = window.Kgm || {};
    window.Kgm.MapHandler = new MapHandler();

    $(window).load(function(){
        window.Kgm.MapHandler.initAddressAuto();
        window.Kgm.MapHandler.toggleMap();
        window.Kgm.MapHandler.processAddDealer();
    });

})(window, window.jQuery);


