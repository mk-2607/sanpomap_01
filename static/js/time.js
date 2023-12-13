function initMap6() {
    var map;
    var directionsService = new google.maps.DirectionsService();
    var directionsRenderer;
    var currentLocation;
    var waypoints = [];
    var currentWaypointIndex = 0; // Navigationのための変数
    var instructionContainer;
    var totalDistanceContainer;

    navigator.geolocation.getCurrentPosition(function (position) {
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

        totalDistanceContainer = document.getElementById('your-total-distance-container-id1');
        instructionContainer = document.getElementById('your-instruction-container-id1');

        var addWaypointButton = document.getElementById('add-waypoint-button1');
        addWaypointButton.addEventListener('click', addRandomWaypoint);

        var navigateButton = document.getElementById('navigate-button1');
        navigateButton.addEventListener('click', navigateToWaypoints);

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

    var existingWaypoints = request.waypoints.map(function (waypoint) {
        return waypoint.location;
    });

    for (var i = 0; i < 4; i++) {
        var randomWaypoint;
        do {
            randomWaypoint = getRandomCoordinate(currentLocation, 0.01);
        } while (hasDuplicate(existingWaypoints, randomWaypoint, 0.02));

        // LatLng オブジェクトを作成して追加
        var newWaypoint = new google.maps.LatLng(randomWaypoint.lat, randomWaypoint.lng);
        request.waypoints.push({
            location: newWaypoint,
            stopover: true
        });
        existingWaypoints.push(newWaypoint);
    }

    console.log('ウェイポイント:', request.waypoints);

    directionsService.route(request, function (result, status) {
        if (status === 'OK') {
            directionsRenderer.setDirections(result);
            var totalDistance = 0;
            result.routes[0].legs.forEach(function (leg) {
                totalDistance += leg.distance.value;
            });
            console.log('総距離:', totalDistance / 1000, 'km');
            waypoints = request.waypoints; // 経由地を保存
            currentWaypointIndex = 0; // Navigationのための初期化
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
                // 巡回地点数に応じて30分で巡回できるように最適化
                var maxDurationInSeconds = 30 * 60;
                calculateAndDisplayRoute(currentLocation, waypoints, maxDurationInSeconds);
            } else {
                alert('経由地がありません。先にランダムな経由地を追加してください。');
            }
        }

        function calculateAndDisplayRoute(origin, waypoints) {
            var maxDurationInSeconds = 30 * 60;  // 30分
            var request = {
                origin: origin,
                destination: origin,
                waypoints: waypoints.map(function (waypoint) {
                    return {
                        location: waypoint.location,
                        stopover: waypoint.stopover
                    };
                }),
                travelMode: 'WALKING'
            };

            directionsService.route(request, function (result, status) {
                if (status === 'OK') {
                    // 巡回時間が30分以内になるように最適化
                    optimizeRouteDuration(result, maxDurationInSeconds, function (optimizedResult) {
                        directionsRenderer.setDirections(optimizedResult);

                        // 総距離を先に表示
                        displayTotalDistance(optimizedResult);

                        // Navigation開始
                        startNavigation(optimizedResult.routes[0].legs[0]);
                    });
                } else {
                    console.error('Directions APIリクエストがステータス', status, 'で失敗しました');
                }
            });
        }

        function optimizeRouteDuration(result, maxDurationInSeconds, callback) {
            // 巡回時間が30分以内になるように最適化ロジックを実装
            // この例では簡易的な実装として、経由地点の順序を変更する方式を採用
            var legs = result.routes[0].legs;
            var currentDuration = 0;
            var optimizedWaypoints = [legs[0].start_location];
            var currentWaypointIndex = 0;

            // 最初のウェイポイントはスタート位置
            optimizedWaypoints.push(legs[0].start_location);

            for (var i = 0; i < legs.length; i++) {
                currentDuration += legs[i].duration.value;

                if (currentDuration <= maxDurationInSeconds) {
                    // ウェイポイントを追加
                    optimizedWaypoints.push({
                        location: legs[i].end_location,
                        stopover: true
                    });
                } else {
                    if (currentWaypointIndex < waypoints.length - 1) {
                        currentWaypointIndex++;
                        optimizedWaypoints.push({
                            location: waypoints[currentWaypointIndex].location,
                            stopover: waypoints[currentWaypointIndex].stopover
                        });
                        currentDuration = 0;
                        i--;
                    } else {
                        break;  // 新たなウェイポイントがない場合は終了
                    }
                }
            }

            // 目的地を追加
            optimizedWaypoints.push(legs[legs.length - 1].end_location);

            var optimizedRequest = {
                origin: optimizedWaypoints[0],
                destination: optimizedWaypoints[optimizedWaypoints.length - 1],
                waypoints: optimizedWaypoints.slice(1, -1).map(function (waypoint) {
                    if (waypoint && waypoint.location) {
                        return {
                            location: waypoint.location,
                            stopover: true
                        };
                    }
                }).filter(Boolean),
                travelMode: 'WALKING'
            };


            directionsService.route(optimizedRequest, function (optimizedResult, status) {
                if (status === 'OK') {
                    callback(optimizedResult);
                } else {
                    console.error('経路の最適化に失敗しました。');
                }
            });
        }

        // 総距離を表示する関数
        function displayTotalDistance(result) {
            var totalDistance = 0;
            result.routes[0].legs.forEach(function (leg) {
                totalDistance += leg.distance.value;
            });

            totalDistanceContainer.innerHTML = '<p><strong>総距離:</strong> ' + (totalDistance / 1000).toFixed(2) + 'km</p>';
        }

        function startNavigation(leg) {
            var stepIndex = 0;
            var watchId;

            function watchPositionSuccess(position) {
                var userCurrentLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                var nextStepLocation = leg.steps[stepIndex].end_location;

                if (google.maps.geometry.spherical.computeDistanceBetween(userCurrentLocation, nextStepLocation) < 10) {
                    if (stepIndex > 0) {
                        instructionContainer.innerHTML = '';
                    }

                    instructionContainer.innerHTML += leg.steps[stepIndex].instructions;

                    stepIndex++;

                    if (stepIndex === leg.steps.length) {
                        navigator.geolocation.clearWatch(watchId);

                        if (currentWaypointIndex < waypoints.length - 1) {
                            currentWaypointIndex++;
                            displayRoute(userCurrentLocation, waypoints[currentWaypointIndex], waypoints.slice(currentWaypointIndex + 1));
                        } else {
                            instructionContainer.innerHTML += '<br>全ての目的地に到達しました。';
                            
                            // TotalDistance モデルに保存
                            saveUserTotalDistance((totalDistance / 1000).toFixed(2));
                        }
                    }
                }
            }

            function watchPositionError(error) {
                console.error('位置情報の取得に失敗しました。', error);
            }

            watchId = navigator.geolocation.watchPosition(watchPositionSuccess, watchPositionError);

            instructionContainer.innerHTML = leg.steps[stepIndex].instructions;
        }
    });
    // ユーザーの総距離をサーバーに保存する関数
    function saveUserTotalDistance(totalDistance) {
        // XMLHttpRequest などを使用してサーバーにデータを送信する処理を実装
        // または、Ajaxライブラリを使用してサーバーサイドにデータを送信
        // 以下はAjaxライブラリを使用した例(jQueryを利用する場合)
    
        $.ajax({
            type: 'POST',
            url: '/save_total_distance/',  // サーバーサイドのURLに適切なものを指定
            data: {
                total_distance: totalDistance
            },
            success: function (response) {
                console.log('Total distance saved successfully.');
            },
            error: function (error) {
                console.error('Error saving total distance:', error);
            }
        });
    }
}

initMap6();
