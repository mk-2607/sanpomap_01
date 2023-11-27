        function initMap3() {
            var mapElement = document.getElementById('map-container');
            var mapOptions = {
                zoom: 15
            };
            var map = new google.maps.Map(mapElement, mapOptions);

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    var userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                    var userMarker = new google.maps.Marker({
                        position: userLocation,
                        map: map,
                        title: '現在地'
                    });

                    var directionsService = new google.maps.DirectionsService();
                    var directionsRenderer = new google.maps.DirectionsRenderer();
                    directionsRenderer.setMap(map);

                    window.addWaypoints = function() {
                        var destination = userLocation;

                        function getWaypoint(type, callback) {
                            var placesService = new google.maps.places.PlacesService(map);
                            placesService.nearbySearch({
                                location: userLocation,
                                radius: 2000,
                                type: type
                            }, function(results, status) {
                                if (status === google.maps.places.PlacesServiceStatus.OK) {
                                    var waypoint = results[0].geometry.location;
                                    callback(waypoint);
                                } else {
                                    console.error('Places APIリクエストがステータス', status, 'で失敗しました');
                                }
                            });
                        }

                        getWaypoint('park', function(waypoint1) {
                            getWaypoint('cafe', function(waypoint2) {
                                getWaypoint('convenience_store', function(waypoint3) {
                                    var request = {
                                        origin: userLocation,
                                        destination: destination,
                                        waypoints: [
                                            { location: waypoint1, stopover: true },
                                            { location: waypoint2, stopover: true },
                                            { location: waypoint3, stopover: true }
                                        ],
                                        travelMode: 'WALKING'
                                    };

                                    directionsService.route(request, function(result, status) {
                                        if (status === 'OK') {
                                            directionsRenderer.setDirections(result);
                                        }
                                    });
                                });
                            });
                        });
                    };
                });
            }
        }
        initMap3();
