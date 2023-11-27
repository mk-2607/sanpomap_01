// 地図を表示する要素を取得
var mapElement = document.getElementById('map-container');

// 地図を初期化する関数
function initMap2() {
  // 現在地を取得
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
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

      placesService.nearbySearch(request, function(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
          // 最寄りの3軒のコンビニを取得
          var nearbyConvenienceStores = results.slice(0, 3);

          // ルートを計画
          var directionsService = new google.maps.DirectionsService();
          var directionsRenderer = new google.maps.DirectionsRenderer({
            map: map
          });

          var waypoints = nearbyConvenienceStores.map(function(store) {
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

          directionsService.route(request, function(result, status) {
            if (status == 'OK') {
              directionsRenderer.setDirections(result);
            }
          });
        }
      });
    });
  } else {
    alert('位置情報を取得できません。');
  }
}
initMap2();