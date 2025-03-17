import React, { useState } from 'react';
import { YMaps, Map, TypeSelector, Polygon, Placemark, Button } from '@pbe/react-yandex-maps';
import axios from 'axios';


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

    const handleSavePolygon = async (coordinates) => {
        if (coordinates.length < 3) {
            alert('Полигон должен содержать как минимум 3 точки.');
            return;
        }

        try {
            const closedCoordinates = [...coordinates, coordinates[0]];

            const requestBody = {
                user_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
                name: 'Test test',
                geometry: {
                    type: 'Polygon',
                    coordinates: [
                        closedCoordinates
                    ]
                }
            };

            const response = await axios.post(`http://${window.location.hostname}:8000/areas`, requestBody, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
                },
            });

            console.log('Сохранённый полигон: ', response.data);
        } catch (error) {
            console.error('Ошибка: ', error);
        }
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

                <Button
                    data={{ content: 'Сохранить полигон' }}
                    options={{ maxWidth: 200 }}
                    onClick={() => handleSavePolygon(polygonCoordinates)}
                />
            </Map>
        </YMaps>
    );
};

export default Main;