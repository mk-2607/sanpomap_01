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
          }
        });
      });
    });
  }
}
initMap4();