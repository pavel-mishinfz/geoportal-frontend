import React from 'react';
import { Polygon } from '@pbe/react-yandex-maps';

const SegmentationLayer = ({ segmentations }) => {
  const getPolygonStyle = (objectTypeId) => {
    const colors = {
      1: '000000', 2: '#00FFFF', 3: '#FFFF00', 4: '#FF00FF', 5: '#00FF00',
      6: '#0000FF', 7: '#FFFFFF'
    };
    return {
      fillColor: colors[objectTypeId] || '#808080',
      strokeColor: colors[objectTypeId] || '#808080',
      opacity: 0.5,
      strokeWidth: 2,
      zIndex: objectTypeId,  // Управление наложением
      interactivityModel: 'default#geoObject',
    };
  };

  const getBalloonContent = (segmentation) => {
    return `
      <div style="padding: 10px; font-family: Arial, sans-serif; font-size: 14px;">
        <strong>${segmentation.object_type.name || 'Неизвестный объект'}</strong><br>
        ID: ${segmentation.id || 'N/A'}
      </div>
    `;
  };

  return (
    <>
      {segmentations
        .filter(segmentation => segmentation.object_type.id !== 1)  // Фильтрация фона
        .map((segmentation, index) => {
          const coordinates = segmentation.geometry.coordinates[0].map(([lon, lat]) => [lat, lon]);  // Преобразование для Yandex Maps

          return (
            <Polygon
              key={index}
              geometry={[coordinates]}
              options={getPolygonStyle(segmentation.object_type.id)}
              properties={{
                balloonContent: getBalloonContent(segmentation),
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

export default SegmentationLayer;