import React, { useState } from 'react';
import { YMaps, Map, TypeSelector, Polygon, Placemark, Button } from '@pbe/react-yandex-maps';

const Main = () => {
    const API_KEY = '5703c528-fb4a-4c0a-a0b1-23d68ed92a66';
    const [editMode, setEditMode] = useState(false);
    const [polygonCoordinates, setPolygonCoordinates] = useState([]);
    const [activePointIndex, setActivePointIndex] = useState(null);

    const handleMapClick = (e) => {
        if (!editMode) return;

        const coords = e.get('coords');
        setPolygonCoordinates([...polygonCoordinates, coords]);
    };

    const handlePlacemarkDrag = (index, newCoords) => {
        const newCoordinates = [...polygonCoordinates];
        newCoordinates[index] = newCoords;
        setPolygonCoordinates(newCoordinates);
    };

    const handlePlacemarkDblClick = (index) => {
        if (!editMode) return;

        const newCoordinates = polygonCoordinates.filter((_, i) => i !== index);
        setPolygonCoordinates(newCoordinates);
    };

    const toggleEditMode = () => {
        setEditMode(!editMode);
        if (!editMode) {
            setPolygonCoordinates([]);
            setActivePointIndex(null);
        }
    };

    const handleMapDblClick = (e) => {
        // Предотвращаем стандартное поведение двойного клика на карте
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <YMaps query={{ apikey: API_KEY }}>
            <Map
                width={'100vw'}
                height={'100vh'}
                defaultState={{
                    center: [54.187433, 45.183938],
                    zoom: 9,
                    controls: [],
                }}
                options={{
                    // Отключаем поведение двойного клика через behaviors
                    behaviors: ['drag', 'scrollZoom'], // Явно указываем только нужные поведения
                }}
                onClick={handleMapClick}
                onDblClick={handleMapDblClick} // Перехватываем двойной клик на карте
            >
                <TypeSelector options={{ float: 'right' }} />

                {polygonCoordinates.length > 0 && (
                    <Polygon
                        geometry={[polygonCoordinates]}
                        options={{
                            fillColor: '#666666',
                            strokeColor: '#000000',
                            opacity: 0.5,
                            strokeWidth: 3,
                        }}
                    />
                )}

                {polygonCoordinates.map((coords, index) => (
                    <Placemark
                        key={index}
                        geometry={coords}
                        options={{
                            draggable: editMode,
                            preset: 'islands#circleIcon',
                            iconColor: '#000000',
                        }}
                        onDrag={(e) => handlePlacemarkDrag(index, e.get('target').geometry.getCoordinates())}
                        onDragEnd={(e) => handlePlacemarkDrag(index, e.get('target').geometry.getCoordinates())}
                        onDblClick={(e) => {
                            e.stopPropagation(); // Останавливаем всплытие события
                            handlePlacemarkDblClick(index);
                        }}
                    />
                ))}

                <Button
                    data={{ content: editMode ? 'Закончить редактирование' : 'Начать редактирование' }}
                    options={{ maxWidth: 200 }}
                    defaultState={{ selected: editMode }}
                    onClick={toggleEditMode}
                />
            </Map>
        </YMaps>
    );
};

export default Main;