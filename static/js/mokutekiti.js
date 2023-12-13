// ページが読み込まれたときに実行
function initMap4() {
  // マップを表示する要素を取得
  var mapElement = document.getElementById('map-container');
  
  // マップオプションを設定
  var mapOptions = {
    center: { lat: 35.682839, lng: 139.759455 }, // マップの初期中心座標（例）
    zoom: 15 // ズームレベル
  };
  
  // マップを初期化
  var map = new google.maps.Map(mapElement, mapOptions);

  // 現在地を取得するGeolocationサービスを使用
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      // 現在地のマーカーを設定
      var userMarker = new google.maps.Marker({
        position: userLocation,
        map: map,
        title: '現在地'
      });

      // ルートを表示するDirectionsServiceオブジェクトを作成
      var directionsService = new google.maps.DirectionsService();

      // ルートを表示するDirectionsRendererオブジェクトを作成
      var directionsRenderer = new google.maps.DirectionsRenderer();
      directionsRenderer.setMap(map);

      // テキストボックスとボタンの要素を取得
      var destinationInput = document.getElementById('destination-input');
      var calculateRouteButton = document.getElementById('calculate-route-button');
      var annaiContainer = document.getElementById('annai-container');

      // ルート計算ボタンがクリックされたときの処理
      calculateRouteButton.addEventListener('click', function() {
        var destination = destinationInput.value;

        // ルートのリクエストを作成
        var request = {
          origin: userLocation, // 出発地点
          destination: destination, // 目的地
          travelMode: 'WALKING' // 交通手段（例: 'DRIVING', 'WALKING', 'TRANSIT', 'BICYCLING'）
        };

        // ルートを取得して表示
        directionsService.route(request, function(result, status) {
          if (status === 'OK') {
            directionsRenderer.setDirections(result);
            
            // 総距離を表示
            displayTotalDistance(result);
            // 道案内を開始
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
          var totalDistanceElement = document.getElementById('total-kyori');
                    
          // 総距離を要素に表示
          totalDistanceElement.innerHTML = '総距離: ' + totalDistanceInKm.toFixed(2) + ' km';
        }
      });

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
    });
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

initMap4();
