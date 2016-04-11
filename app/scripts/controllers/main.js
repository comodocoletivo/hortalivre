'use strict';

/**
 * @ngdoc function
 * @name hortalivreApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the hortalivreApp
 */
angular.module('hortalivreApp')
  .controller('MainCtrl', ['$scope', 'Notification', function ($scope, Notification) {

    // obtém a localização do usuário
    function _getLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(_initMap, error);
      } else {
        Notification.show('error', 'Hortalivre', 'Seu browser não suporta geolocalização.')
      }
    }

    function error(error) {
      console.warn('Error: ', error);
      Notification.show('error', 'Hortalivre', error);
    }

    // obtém mais marcadores quando move o mapa
    function _showMarkers() {
      var bounds, south, south_lat, south_lng, north,
      north_lat, north_lng, center_lat, center_lng,
      marker, latLng;

      bounds = map.getBounds();

      // south = map.getBounds().getSouthWest();
      south_lat = map.getBounds().getSouthWest().lat();
      south_lng = map.getBounds().getSouthWest().lng();

      // north = map.getBounds().getNorthEast();
      north_lat = map.getBounds().getNorthEast().lat();
      north_lng = map.getBounds().getNorthEast().lng();

      center_lat = (south_lat + north_lat) / 2;
      center_lng = (south_lng + north_lng) / 2;

      latLng = {
        'center_lat': center_lat,
        'center_lng': center_lng
      };

      console.warn('Latitude / Longitude: ', latLng);

      marker = new google.maps.Marker({
        position: new google.maps.LatLng(center_lat, center_lng),
        map: map
      });
    }

    // obtém as coordenadas de acordo com o desenho no mapa
    function _getCoordinates(polygon) {
      var coordinates;

      coordinates = (polygon.getPath().getArray());

      console.warn('Coordinates of drawing: ', coordinates);
    }

    // inicia o mapa
    function _initMap(position) {
      var userPosition, map, marker, drawingManager, infowindow;

      infowindow = new google.maps.InfoWindow;

      userPosition = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      map = new google.maps.Map(document.getElementById('map-home'), {
        center: userPosition,
        zoom: 14,
        mapTypeControl: false,
        panControl: false,
        streetViewControl: false,
        zoomControl: true,
        scrollwheel: false,
        draggable: true,
        zoomControlOptions: {
          style: google.maps.ZoomControlStyle.SMALL
        }
      });

      marker = new google.maps.Marker({
        position: userPosition,
        map: map
      });

      marker.addListener('click', function() {
        infowindow.setContent('Você está aqui!');
        infowindow.open(map, marker);

        map.setZoom(10);
        map.setCenter(marker.getPosition());
      });

      drawingManager = new google.maps.drawing.DrawingManager({
        drawingControl: true,
        drawingControlOptions: {
          position: google.maps.ControlPosition.TOP_RIGHT,
          drawingModes: [google.maps.drawing.OverlayType.POLYGON]
        },
        polygonOptions: {
          editable: true,
          clickable: true,
          draggable: true,
          strokeColor: '#1E90FF',
          strokeOpacity: 0.7,
          fillColor: '#1E90FF',
          fillOpacity: 0.2,
          strokeWeight: 2,
        }
      });

      drawingManager.setMap(map);


      // Eventos

      // carrega mais marcadores
      // google.maps.event.addListener(map, 'idle', _showMarkers);

      // Permite o usuário desenhar no mapa
      // google.maps.event.addListener(drawingManager, 'polygoncomplete', _getCoordinates);
    }
    // ====

    $scope.loadMap = function() {
      // _getLocation();
    }


    // Pesquisar as feiras
    $scope.map = {};

    $scope.searchHortas = function() {
      $scope.map.type = 'hortas';
    };

    $scope.searchFeiras = function() {
      $scope.map.type = 'feiras';
    };

    $scope.search = function() {
      var params = $scope.map;

      console.warn('Enviando -> ', params);
    }
    // ====

  }]);
