// styles/customStyle.js
export const customStyle = [
  /* Base */
  {
    "elementType": "geometry",
    "stylers": [{ "color": "#E6E9EC" }]
  },

  /* Labels */
  {
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#2B2F33" }]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [{ "color": "#FFFFFF" }]
  },

  /* Country border – black */
  {
    "featureType": "administrative.country",
    "elementType": "geometry.stroke",
    "stylers": [
      { "color": "#000000" },
      { "weight": 1.8 }
    ]
  },

  /* State border – dark grey */
  {
    "featureType": "administrative.province",
    "elementType": "geometry.stroke",
    "stylers": [
      { "color": "#4B5563" },
      { "weight": 1.2 }
    ]
  },

  /* Highways / NH */
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [{ "color": "#9CA3AF" }]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#111827" }]
  },

  /* Main roads */
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [{ "color": "#FFFFFF" }]
  },

  /* Local streets (slightly off-white so they don't disappear) */
  {
    "featureType": "road.local",
    "elementType": "geometry",
    "stylers": [{ "color": "#F8FAFC" }]
  },

  /* Buildings (soft depth illusion) */
  {
    "featureType": "poi.business",
    "elementType": "geometry",
    "stylers": [{ "color": "#E1E4E8" }]
  },

  /* Parks */
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [{ "color": "#CCF630" }]
  },

  /* Water */
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [{ "color": "#A9D8F3" }]
  },

  /* Railway lines */
  {
    "featureType": "transit.line",
    "elementType": "geometry",
    "stylers": [
      { "visibility": "on" },
      { "color": "#d8d8d8" },
      { "weight": 1.4 }
    ]
  },

  /* Railway stations (icons + names) */
  {
    "featureType": "transit.station",
    "elementType": "geometry",
    "stylers": [
      { "visibility": "on" },
      { "color": "#cdcfd1" }
    ]
  },

  {
    "featureType": "transit.station",
    "elementType": "labels.text.fill",
    "stylers": [{ "color": "#374151" }]
  },

  /* Hide unnecessary POI icons only */
  {
    "featureType": "poi",
    "elementType": "labels.icon",
    "stylers": [{ "visibility": "off" }]
  }
];
