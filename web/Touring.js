$(document).ready(function(){
    $("#searchno").on('input',function(){
        var bounds = new google.maps.LatLngBounds();
        var markers = [];
        var map = new google.maps.Map(document.getElementById('map-canvas'), {
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        var defaultBounds = new google.maps.LatLngBounds(
            new google.maps.LatLng(49.3457868, -124.7844079),
            new google.maps.LatLng(24.7433195, -66.9513812)
        );
        
        map.fitBounds(defaultBounds);

        var number = $("#searchno").val();
        var input= [];
        var searchBox= [];

        for(var j=1; j<=number ;j++)
        {
            input[j] = document.createElement("input");
            input[j].setAttribute("type", "text");
   
            if(j===1)
                map.controls[google.maps.ControlPosition.TOP_LEFT].push(input[j]);
            if(j===2)
            {
                map.controls[google.maps.ControlPosition.TOP_CENTER].push(input[j]);
            }
            if(j===3)
            {  
                map.controls[google.maps.ControlPosition.TOP_RIGHT].push(input[j]);
            }
            if(j===4)
            { 
                map.controls[google.maps.ControlPosition.LEFT_TOP].push(input[j]);
            }

            searchBox[j] = new google.maps.places.SearchBox(
                /** @type {HTMLInputElement} */(input[j]));
            listening(j);
        }
  
        function listening(k)
        {
            google.maps.event.addListener(searchBox[k], 'places_changed', function() {
                var places = searchBox[k].getPlaces();

                if (places.length === 0) {
                  return;
                }
            
                for (var i = 0, marker; marker = markers[i]; i++) {
                    marker.setMap(null);
                }

                for (var i = 0, place; place = places[i]; i++) {
                   var image = {
                        url: place.icon,
                        size: new google.maps.Size(71, 71),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(17, 34),
                        scaledSize: new google.maps.Size(25, 25)
                    };

                    marker = new google.maps.Marker({
                        map: map,
                        icon: image,
                        title: place.name,
                        position: place.geometry.location
                    });

                    marker.setMap(map);
     
                    bounds.extend(place.geometry.location);
                }

                map.fitBounds(bounds);
            });
        }
   });
});
   