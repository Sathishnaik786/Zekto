const calculateDistance = (point1, point2) => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(point2[1] - point1[1]);
  const dLon = toRad(point2[0] - point1[0]);
  const lat1 = toRad(point1[1]);
  const lat2 = toRad(point2[1]);

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const toRad = (value) => {
  return value * Math.PI / 180;
};

const createGeoJSONPoint = (coordinates) => {
  return {
    type: 'Point',
    coordinates: coordinates
  };
};

const createGeoJSONPolygon = (coordinates) => {
  return {
    type: 'Polygon',
    coordinates: [coordinates]
  };
};

const isPointInPolygon = (point, polygon) => {
  const x = point[0], y = point[1];
  let inside = false;
  
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    
    const intersect = ((yi > y) !== (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  
  return inside;
};

module.exports = {
  calculateDistance,
  createGeoJSONPoint,
  createGeoJSONPolygon,
  isPointInPolygon
}; 