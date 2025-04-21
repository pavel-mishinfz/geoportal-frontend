import React from 'react';
import { Polygon } from '@pbe/react-yandex-maps';

const DetectionLayer = ({ detections }) => {
  const getPolygonStyle = (objectTypeId) => {
    const colors = {
      1: '#FF0000', 2: '#0000FF', 3: '#008000', 4: '#800080',
      5: '#FFA500', 6: '#FFFF00', 7: '#FFC0CB', 8: '#00FFFF',
      9: '#FF00FF', 10: '#00FF00', 11: '#008080', 12: '#EE82EE',
      13: '#A52A2A', 14: '#000080', 15: '#FF7F50', 16: '#FFD700',
      17: '#4B0082', 18: '#40E0D0', 19: '#FA8072', 20: '#808000',
    };
    return {
      fillColor: colors[objectTypeId] || '#808080',
      strokeColor: colors[objectTypeId] || '#808080',
      opacity: 0.5,
      strokeWidth: 2,
      interactivityModel: 'default#geoObject',
    };
  };

  const getBalloonContent = (detection) => {
    return `
      <div style="padding: 10px; font-family: Arial, sans-serif; font-size: 14px;">
        <strong>${detection.object_type.name || 'Неизвестный объект'}</strong><br>
        Уверенность: ${detection.score ? detection.score.toFixed(2) : 'N/A'}<br>
        ID: ${detection.id || 'N/A'}
      </div>
    `;
  };

  return (
    <>
      {detections.map((detection, index) => {
        const coordinates = detection.geometry.coordinates[0].map(([lon, lat]) => [lat, lon]);

        return (
          <Polygon
            key={index}
            geometry={[coordinates]}
            options={getPolygonStyle(detection.object_type.id)}
            properties={{
              // hintContent: detection.object_type.name || 'Неизвестный объект',
              balloonContent: getBalloonContent(detection),
            }}
            modules={['geoObject.addon.balloon', 'geoObject.addon.hint']}
            onClick={(e) => {
              const polygon = e.get('target');
              polygon.balloon.open();
            }}
          />
        );
      })}
    </>
  );
};

export default DetectionLayer;