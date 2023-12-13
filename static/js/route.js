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
            
            var annaiContainer = document.getElementById('annai-container1');
    
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
                        
                        // 総距離を表示
                        displayTotalDistance(response);
                        // 道案内を開始
                        startNavigation(response.routes[0].legs[0]);
                    } else {
                        window.alert('ルートの取得に失敗しました: ' + status);
                    }
                });
                function displayTotalDistance(response) {
                        var totalDistance = 0;
                        for (var i = 0; i < response.routes[0].legs.length; i++) {
                            totalDistance += response.routes[0].legs[i].distance.value;
                        }
                            
                        // 総距離をメートルからキロメートルに変換して表示
                        var totalDistanceInKm = totalDistance / 1000;
                                    
                        // 総距離を表示する要素を取得
                        var totalDistanceElement = document.getElementById('total-kyori1');
                                
                        // 総距離を要素に表示
                        totalDistanceElement.innerHTML = '総距離: ' + totalDistanceInKm.toFixed(2) + ' km';
                        
                        // 道案内コンテナをリセット
                        annaiContainer.innerHTML = '';
                }
            };
            
                  // 道案内を開始する関数
                  function startNavigation(leg) {
                    var stepIndex = 0;
                    var watchId;
            
                    function watchPositionSuccess(position) {
                      // ユーザーの現在位置を取得
                      var userCurrentLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                      };
            
                      // 次のステップの位置を取得
                      var nextStepLocation = leg.steps[stepIndex].end_location;
            
                      // ユーザーが次のステップに到達したら
                      if (google.maps.geometry.spherical.computeDistanceBetween(userCurrentLocation, nextStepLocation) < 10) {
                        // 最初の案内を非表示にする
                        if (stepIndex > 0) {
                          annaiContainer.innerHTML = '';
                        }
            
                        // ユーザーに案内情報を表示
                        annaiContainer.innerHTML += leg.steps[stepIndex].instructions;
            
                        // 次のステップへ
                        stepIndex++;
            
                        // 最後のステップに到達したら
                        if (stepIndex === leg.steps.length) {
                        // ウォッチを停止
                        navigator.geolocation.clearWatch(watchId);
            
                        // 道案内終了メッセージを表示
                        annaiContainer.innerHTML += '<br>目的地に到達しました。';
                          
                        // TotalDistance モデルに保存
                        saveUserTotalDistance(totalDistanceInKm.toFixed(2));
                        }
                      }
                    }
            
                    function watchPositionError(error) {
                      console.error('位置情報の取得に失敗しました。', error);
                    }
            
                    // ユーザーの位置を監視
                    watchId = navigator.geolocation.watchPosition(watchPositionSuccess, watchPositionError);
            
                    // 最初の案内情報を表示
                    annaiContainer.innerHTML = leg.steps[stepIndex].instructions;
                  }
            
            function calculateOptimizedWaypoints(waypoints) {
            // ここで最適な順序を計算するロジックを実装する
            // waypoints 配列に対して最適な順序を計算し、その順序に従って配列を並べ替える

            // 例: 現在の実装では経由地リストをそのまま返す
            return waypoints;
            }
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
            initMap1();