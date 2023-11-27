        function initMap5() {
            var map;
            var directionsService = new google.maps.DirectionsService();
            var directionsRenderer;
            var currentLocation;
            var waypoints = [];

            navigator.geolocation.getCurrentPosition(function(position) {
                currentLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                map = new google.maps.Map(document.getElementById('map-container'), {
                    zoom: 15,
                    center: currentLocation
                });

                directionsRenderer = new google.maps.DirectionsRenderer({
                    map: map,
                    draggable: true,
                    
                });

                function getRandomCoordinate(center, radius) {
                    var randomAngle = Math.random() * 2 * Math.PI;
                    var randomRadius = Math.random() * radius;
                    var lat = center.lat + randomRadius * Math.sin(randomAngle);
                    var lng = center.lng + randomRadius * Math.cos(randomAngle);
                    return { lat: lat, lng: lng };
                }

                function calculateDistance(point1, point2) {
                    var R = 6371;
                    var dLat = (point2.lat - point1.lat) * Math.PI / 180;
                    var dLon = (point2.lng - point1.lng) * Math.PI / 180;
                    var a =
                        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                        Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
                    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    var distance = R * c;
                    return distance;
                }

                function addRandomWaypoint() {
                    var request = {
                        origin: currentLocation,
                        destination: currentLocation,
                        travelMode: 'WALKING',
                        waypoints: [],
                        unitSystem: google.maps.UnitSystem.METRIC
                    };

                    var existingWaypoints = request.waypoints.map(function(waypoint) {
                        return waypoint.location;
                    });

                    for (var i = 0; i < 3; i++) {
                        var randomWaypoint;
                        do {
                            randomWaypoint = getRandomCoordinate(currentLocation, 0.02);
                        } while (hasDuplicate(existingWaypoints, randomWaypoint, 0.04));

                        request.waypoints.push({
                            location: randomWaypoint,
                            stopover: true
                        });
                        existingWaypoints.push(randomWaypoint);
                    }

                    directionsService.route(request, function(result, status) {
                        if (status === 'OK') {
                            directionsRenderer.setDirections(result);
                            var totalDistance = 0;
                            result.routes[0].legs.forEach(function(leg) {
                                totalDistance += leg.distance.value;
                            });
                            console.log('総距離:', totalDistance / 1000, 'キロメートル');
                            waypoints = request.waypoints; // 経由地を保存
                        } else {
                            console.error('Directions APIリクエストがステータス', status, 'で失敗しました');
                        }
                    });
                }

                function hasDuplicate(existingWaypoints, newWaypoint, minDistance) {
                    for (var i = 0; i < existingWaypoints.length; i++) {
                        var distance = calculateDistance(existingWaypoints[i], newWaypoint);
                        if (distance < minDistance) {
                            return true;
                        }
                    }
                    return false;
                }

                function navigateToWaypoints() {
                    if (waypoints.length > 0) {
                        calculateAndDisplayRoute(currentLocation, waypoints);
                    } else {
                        alert('経由地がありません。先にランダムな経由地を追加してください。');
                    }
                }

                function calculateAndDisplayRoute(origin, waypoints) {
                    var request = {
                        origin: origin,
                        destination: origin,
                        waypoints: waypoints,
                        travelMode: 'WALKING'
                    };

                    directionsService.route(request, function(result, status) {
                        if (status === 'OK') {
                            directionsRenderer.setDirections(result);
                            displayRouteInfo(result);
                        } else {
                            console.error('Directions APIリクエストがステータス', status, 'で失敗しました');
                        }
                    });
                }
                
                function displayRouteInfo(result) {
                    var directionsPanel = document.getElementById('directions-panel');
                    directionsPanel.innerHTML = ''; // パネルをクリア

                    var totalDistance = 0;
                    result.routes[0].legs.forEach(function(leg) {
                        totalDistance += leg.distance.value;
                        var steps = leg.steps.map(function(step) {
                            return step.instructions;
                        });
                        var legInfo = '<p><strong>距離:</strong> ' + leg.distance.text + '</p>' +
                                      '<p><strong>行き方:</strong></p>' +
                                      '<ul><li>' + steps.join('</li><li>') + '</li></ul>';
                        directionsPanel.innerHTML += legInfo;
                    });

                    console.log('総距離:', totalDistance / 1000, 'キロメートル');
                    directionsPanel.innerHTML += '<p><strong>総距離:</strong> ' + (totalDistance / 1000).toFixed(2) + ' キロメートル</p>';
                }

                var addWaypointButton = document.getElementById('add-waypoint-button');
                addWaypointButton.addEventListener('click', addRandomWaypoint);

                var navigateButton = document.getElementById('navigate-button');
                navigateButton.addEventListener('click', navigateToWaypoints);
            });
        }

        initMap5();
