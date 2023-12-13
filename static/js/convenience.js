// 地図を表示する要素を取得
var mapElement = document.getElementById('map-container');

// 地図を初期化する関数
function initMap2() {
    // 現在地を取得
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            // 地図を表示
            var map = new google.maps.Map(mapElement, {
                center: currentLocation,
                zoom: 15
            });

            // 現在地を地図に表示
            var currentLocationMarker = new google.maps.Marker({
                position: currentLocation,
                map: map,
                title: '現在地'
            });

            // 近くのコンビニを検索
            var placesService = new google.maps.places.PlacesService(map);
            var request = {
                location: currentLocation,
                radius: 1000, // 1キロ以内を検索
                types: ['convenience_store']
            };

            placesService.nearbySearch(request, function (results, status) {
                if (status == google.maps.places.PlacesServiceStatus.OK) {
                    // 最寄りの3軒のコンビニを取得
                    var nearbyConvenienceStores = results.slice(0, 3);

                    // ルートを計画
                    var directionsService = new google.maps.DirectionsService();
                    var directionsRenderer = new google.maps.DirectionsRenderer({
                        map: map
                    });

                    var waypoints = nearbyConvenienceStores.map(function (store) {
                        return {
                            location: store.geometry.location,
                            stopover: true
                        };
                    });

                    var request = {
                        origin: currentLocation,
                        destination: currentLocation,
                        waypoints: waypoints,
                        optimizeWaypoints: true,
                        travelMode: 'WALKING'
                    };

                    directionsService.route(request, function (result, status) {
                        if (status == 'OK') {
                            directionsRenderer.setDirections(result);

                            // 総距離を表示
                            displayTotalDistance(result);
                            // ナビゲーションを開始
                            startNavigation(result.routes[0].legs[0]);
                        }
                    });
                    
                    function displayTotalDistance(result) {
                        var totalDistance = 0;
                        for (var i = 0; i < result.routes[0].legs.length; i++) {
                            totalDistance += result.routes[0].legs[i].distance.value;
                        }
                
                        // 総距離をメートルからキロメートルに変換して表示
                        var totalDistanceInKm = totalDistance / 1000;
                        
                        // 総距離を表示する要素を取得
                        var totalDistanceElement = document.getElementById('total-distance');
                    
                        // 総距離を要素に表示
                        totalDistanceElement.innerHTML = '総距離: ' + totalDistanceInKm.toFixed(2) + ' km';
                    }
                }
            });

            // instructionContainerを定義
            var instructionContainer = document.getElementById('instruction-container');

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
                            instructionContainer.innerHTML = '';
                        }

                        // ユーザーに案内情報を表示
                        instructionContainer.innerHTML += leg.steps[stepIndex].instructions;

                        // 次のステップへ
                        stepIndex++;

                        // 最後のステップに到達したら
                        if (stepIndex === leg.steps.length) {
                            // ウォッチを停止
                            navigator.geolocation.clearWatch(watchId);

                            // 目的地に到達したら、次の目的地への案内を始める
                            if (currentWaypointIndex < waypoints.length - 1) {
                                currentWaypointIndex++;
                                displayRoute(userCurrentLocation, waypoints[currentWaypointIndex], waypoints.slice(currentWaypointIndex + 1));
                            } else {
                                
                                
                                // 全ての目的地に到達したら
                                instructionContainer.innerHTML += '<br>全ての目的地に到達しました。';
                                
                                // TotalDistance モデルに保存
                                saveUserTotalDistance(totalDistanceInKm.toFixed(2));
                            }
                        }
                    }
                }

                function watchPositionError(error) {
                    console.error('位置情報の取得に失敗しました。', error);
                }

                // ユーザーの位置を監視
                watchId = navigator.geolocation.watchPosition(watchPositionSuccess, watchPositionError);

                // 最初の案内情報を表示
                instructionContainer.innerHTML = leg.steps[stepIndex].instructions;
            }
        });
    } else {
        alert('位置情報を取得できません。');
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
}
// 初期化関数を呼び出す
initMap2();
