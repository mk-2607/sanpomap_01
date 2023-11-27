            var map;
            var directionsService;
            var directionsDisplay;
            var waypoints = [];
            var originLocation; // 出発地（ユーザーの現在位置）
            var destinationLocation; // 到着地
    
            function initMap1() {
                map = new google.maps.Map(document.getElementById('map-container'), {
                    zoom: 15
                });
    
                directionsService = new google.maps.DirectionsService();
                directionsDisplay = new google.maps.DirectionsRenderer({ map: map });
                
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(function (position) {
                        var userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    };

                        originLocation = userLocation;
                        destinationLocation = userLocation;
                    });
                }
            }
            initMap1();
      　　　
      　　　
            function addWaypoint() {
                if (waypoints.length >= 5) {
                    alert('経由地は最大5個までになっています。');
                    return;
                }
    
                var waypointInput = document.getElementById('waypointInput');
                var waypointAddress = waypointInput.value;
    
                if (waypointAddress) {
                    // テキストボックスから入力された場所を経由地として追加
                    waypoints.push({
                        location: waypointAddress,
                        stopover: true
                    });
    
                    // テキストボックスをクリア
                    waypointInput.value = '';
    
                    // 経由地リストを更新
                    updateWaypointList();
    
                    // ルートを再計算して表示
                    calculateAndDisplayRoute();
                }
            }
            
            function resetWaypoints() {
                // 経由地リストと地図上のルートをクリア
                waypoints = [];
                document.getElementById('waypointsList').innerHTML = '';
                directionsDisplay.setDirections({ routes: [] });
            }
    
            function updateWaypointList() {
                var waypointsList = document.getElementById('waypointsList');
                waypointsList.innerHTML = '';
    
                waypoints.forEach(function (waypoint) {
                    var li = document.createElement('li');
                    li.textContent = waypoint.location;
                    waypointsList.appendChild(li);
                });
            }
    
            function calculateAndDisplayRoute() {
                var allWaypoints = [originLocation].concat(waypoints).concat(destinationLocation);

                // 最適な順序の経由地リストを計算
                var optimizedWaypoints = calculateOptimizedWaypoints(allWaypoints);
    
                // Directions API にリクエストを送信
                var request = {
                    origin: optimizedWaypoints[0],
                    destination: optimizedWaypoints[optimizedWaypoints.length - 1],
                    waypoints: optimizedWaypoints.slice(1, -1),
                    travelMode: 'WALKING'
                };
    
                directionsService.route(request, function (response, status) {
                    if (status === 'OK') {
                        directionsDisplay.setDirections(response);
                    } else {
                        window.alert('ルートの取得に失敗しました: ' + status);
                    }
                });
            }
            
            function calculateOptimizedWaypoints(waypoints) {
            // ここで最適な順序を計算するロジックを実装する
            // waypoints 配列に対して最適な順序を計算し、その順序に従って配列を並べ替える

            // 例: 現在の実装では経由地リストをそのまま返す
            return waypoints;
            }