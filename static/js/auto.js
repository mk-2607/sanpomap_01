var map;
var directionsService;
var directionsRenderer;
var instructionContainer;
var legs;

function initMap3() {
    var mapElement = document.getElementById('map-container');
    var mapOptions = {
        center: { lat: 35.682839, lng: 139.759455 },
        zoom: 15
    };
    map = new google.maps.Map(mapElement, mapOptions);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            var userMarker = new google.maps.Marker({
                position: userLocation,
                map: map,
                title: '現在地'
            });

            directionsService = new google.maps.DirectionsService();
            directionsRenderer = new google.maps.DirectionsRenderer();
            directionsRenderer.setMap(map);

            // instructionContainer を取得
            instructionContainer = document.getElementById('instruction-container1');

            // addWaypoints 関数を宣言
            function addWaypoints() {
                var destination = userLocation;

                function getWaypoint(type, callback) {
                    var placesService = new google.maps.places.PlacesService(map);
                    placesService.nearbySearch({
                        location: userLocation,
                        radius: 2000,
                        type: type
                    }, function (results, status) {
                        if (status === google.maps.places.PlacesServiceStatus.OK) {
                            var waypoint = results[0].geometry.location;
                            callback(waypoint);
                        } else {
                            console.error('Places APIリクエストがステータス', status, 'で失敗しました');
                        }
                    });
                }

                getWaypoint('park', function (waypoint1) {
                    getWaypoint('cafe', function (waypoint2) {
                        getWaypoint('convenience_store', function (waypoint3) {
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

                            directionsService.route(request, function (result, status) {
                                if (status === 'OK') {
                                    directionsRenderer.setDirections(result);
                                    
                                    // legs を設定
                                    legs = result.routes[0].legs;

                                    // ルートを道案内するボタンを追加
                                    var startNavigationButton = document.createElement('button');
                                    startNavigationButton.textContent = 'ルートを道案内する';
                                    startNavigationButton.addEventListener('click', function () {
                                        startNavigation(legs);
                                    });

                                    // ボタンを追加する要素にアクセスしてappendChildでボタンを追加
                                    var buttonContainer = document.getElementById('button-container');
                                    buttonContainer.innerHTML = '';
                                    buttonContainer.appendChild(startNavigationButton);
                                    
                                    // 総距離を表示
                                    displayTotalDistance(result);
                                }
                            });
                        });
                    });
                });
            }

            // addWaypoints ボタンにイベントリスナーを追加
            document.getElementById('addWaypointsButton').addEventListener('click', function () {
                addWaypoints();
            });
        });
    }
}

function displayTotalDistance(result) {
    var totalDistance = 0;
    for (var i = 0; i < result.routes[0].legs.length; i++) {
        totalDistance += result.routes[0].legs[i].distance.value;
    }

    // 総距離をメートルからキロメートルに変換して表示
    var totalDistanceInKm = totalDistance / 1000;

    // 総距離を表示する要素を取得
    var totalDistanceElement = document.getElementById('total-distance1');

    // 要素が存在するかを確認してから表示
    if (totalDistanceElement) {
        totalDistanceElement.innerHTML = '総距離: ' + totalDistanceInKm.toFixed(2) + ' km';
    } else {
        // エラーメッセージをコンソールに出力
        console.error("IDが 'total-distance1' の要素が見つかりませんでした。");
    }
}

function startNavigation(legs) {
    var stepIndex = 0;
    var watchId;

    function watchPositionSuccess(position) {
        // ユーザーの現在位置を取得
        var userCurrentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

        // 次のステップの位置を取得
        var nextStepLocation = legs[0].steps[stepIndex].end_location;

        // ユーザーが次のステップに到達したら
        if (google.maps.geometry.spherical.computeDistanceBetween(userCurrentLocation, nextStepLocation) < 10) {
            // 最初の案内を非表示にする
            if (stepIndex > 0) {
                instructionContainer.innerHTML = '';
            }

            // ユーザーに案内情報を表示
            instructionContainer.innerHTML += legs[0].steps[stepIndex].instructions;

            // 次のステップへ
            stepIndex++;

            // 最後のステップに到達したら
            if (stepIndex === legs[0].steps.length) {
                // ウォッチを停止
                navigator.geolocation.clearWatch(watchId);

                // 道案内完了時にメッセージを表示
                instructionContainer.innerHTML += '<br>道案内が完了しました。';
                
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
    instructionContainer.innerHTML = legs[0].steps[stepIndex].instructions;
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

// 初期化関数を呼び出す
initMap3();
