
import React from 'react';
import { YMaps, Map, TypeSelector, Polygon, Placemark, Button } from '@pbe/react-yandex-maps';
// import 'leaflet/dist/leaflet.css';
import SegmentationLayer from './SegmentationLayer';

const MapComponent = ({
    polygonCoordinates,
    selectedPolygonCoords,
    isAddingPolygon,
    isEditing,
    handleMapClick,
    handleMapDblClick,
    handlePlacemarkDrag,
    handlePlacemarkDblClick,
    setIsSidebarOpen,
    segmentations
}) => {
    return (
        <YMaps query={{ apikey: process.env.REACT_APP_YMAP_API_KEY }}>
            <Map
                width={'100vw'}
                height={'100vh'}
                defaultState={{ center: [54.187433, 45.183938], zoom: 9, controls: [] }}
                options={{ behaviors: ['drag', 'scrollZoom'] }}
                onClick={handleMapClick}
                onDblClick={handleMapDblClick}
            >
                <TypeSelector options={{ float: 'right' }} />

                {polygonCoordinates && polygonCoordinates.length > 0 && (
                    <>
                        <Polygon
                            geometry={[polygonCoordinates]}
                            options={{ fillColor: '#666666', strokeColor: '#000000', opacity: 0.5, strokeWidth: 3 }}
                        />
                        {polygonCoordinates.map((coords, index) => (
                            <Placemark
                                key={index}
                                geometry={coords}
                                options={{
                                    draggable: isAddingPolygon || isEditing,
                                    preset: 'islands#circleIcon',
                                    iconColor: '#000000',
                                }}
                                onDrag={(e) => handlePlacemarkDrag(index, e.get('target').geometry.getCoordinates())}
                                onDragEnd={(e) => handlePlacemarkDrag(index, e.get('target').geometry.getCoordinates())}
                                onDblClick={(e) => {
                                    e.stopPropagation();
                                    handlePlacemarkDblClick(index);
                                }}
                            />
                        ))}
                    </>
                )}

                {selectedPolygonCoords && selectedPolygonCoords.length > 0 && (
                    <>
                        <Polygon
                            geometry={[selectedPolygonCoords]}
                            options={{ fillColor: '#666666', strokeColor: '#000000', opacity: 0.5, strokeWidth: 3 }}
                        />
                        {selectedPolygonCoords.map((coords, index) => (
                            <Placemark
                                key={`selected-${index}`}
                                geometry={coords}
                                options={{ draggable: false, preset: 'islands#circleIcon', iconColor: '#000000' }}
                            />
                        ))}
                    </>
                )}

                <SegmentationLayer segmentations={segmentations}/>

                <Button
                    data={{ content: 'Мои полигоны' }}
                    options={{ maxWidth: 200, position: { top: '10px', left: '10px' } }}
                    onClick={() => setIsSidebarOpen(true)}
                />
            </Map>
        </YMaps>
    );
};

export default MapComponent;