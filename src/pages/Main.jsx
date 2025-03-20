import React, { useState, useEffect } from 'react';
import { YMaps, Map, TypeSelector, Polygon, Placemark, Button } from '@pbe/react-yandex-maps';
import axios from 'axios';
import '../css/Main.css';

const Main = () => {
    const username = 'Username';
    const userId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

    const [polygonCoordinates, setPolygonCoordinates] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [polygons, setPolygons] = useState([]);
    const [isAddingPolygon, setIsAddingPolygon] = useState(false);
    const [polygonName, setPolygonName] = useState('');
    const [selectedPolygonCoords, setSelectedPolygonCoords] = useState(null); // Новое состояние для выбранного полигона

    useEffect(() => {
        fetchPolygons();
    }, []);

    const fetchPolygons = async () => {
        try {
            const response = await axios.get(`http://${process.env.REACT_APP_HOSTNAME}/areas?user_id=${userId}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
                },
            });
            setPolygons(response.data);
        } catch (error) {
            console.error('Ошибка при загрузке полигонов:', error);
        }
    };

    const handleMapClick = (e) => {
        if (!isAddingPolygon) return;
        const coords = e.get('coords');
        setPolygonCoordinates([...polygonCoordinates, coords]);
    };

    const handlePlacemarkDrag = (index, newCoords) => {
        const newCoordinates = [...polygonCoordinates];
        newCoordinates[index] = newCoords;
        setPolygonCoordinates(newCoordinates);
    };

    const handlePlacemarkDblClick = (index) => {
        if (!isAddingPolygon) return;
        const newCoordinates = polygonCoordinates.filter((_, i) => i !== index);
        setPolygonCoordinates(newCoordinates);
    };


    const handleMapDblClick = (e) => {
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
                user_id: userId,
                name: polygonName || `Polygon ${new Date().toLocaleDateString()}`,
                geometry: {
                    type: 'Polygon',
                    coordinates: [closedCoordinates]
                }
            };

            await axios.post(`http://${process.env.REACT_APP_HOSTNAME}/areas`, requestBody, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
                },
            });

            setPolygonCoordinates([]);
            setIsAddingPolygon(false);
            setPolygonName('');
            setIsSidebarOpen(true);
            fetchPolygons();
        } catch (error) {
            console.error('Ошибка при создании полигона: ', error);
        }
    };

    const handleAddPolygon = () => {
        setIsAddingPolygon(true);
        setSelectedPolygonCoords(null); // Очищаем выбранный полигон при добавлении нового
    };

    // Обработчик клика по полигону с запросом на сервер
    const handlePolygonSelect = async (polygonId) => {
        try {
            const response = await axios.get(`http://${process.env.REACT_APP_HOSTNAME}/areas/${polygonId}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
                },
            });
            const polygon = response.data;
            const coords = polygon.geometry.coordinates[0].slice(0, -1); // Убираем дублирующую точку
            setSelectedPolygonCoords(coords);
            setPolygonCoordinates([]); // Очищаем текущие координаты редактирования
            setIsAddingPolygon(false); // Выключаем режим добавления
        } catch (error) {
            console.error('Ошибка при загрузке полигона:', error);
        }
    };

    return (
        <YMaps query={{ apikey: process.env.REACT_APP_YMAP_API_KEY }}>
            <div style={{ position: 'relative' }}>
                <Map
                    width={'100vw'}
                    height={'100vh'}
                    defaultState={{
                        center: [54.187433, 45.183938],
                        zoom: 9,
                        controls: [],
                    }}
                    options={{
                        behaviors: ['drag', 'scrollZoom'],
                    }}
                    onClick={handleMapClick}
                    onDblClick={handleMapDblClick}
                >
                    <TypeSelector options={{ float: 'right' }} />

                    {/* Отображение редактируемого полигона */}
                    {polygonCoordinates && polygonCoordinates.length > 0 && (
                        <>
                            <Polygon
                                geometry={[polygonCoordinates]}
                                options={{
                                    fillColor: '#666666',
                                    strokeColor: '#000000',
                                    opacity: 0.5,
                                    strokeWidth: 3,
                                }}
                            />
                            {polygonCoordinates.map((coords, index) => (
                                <Placemark
                                    key={index}
                                    geometry={coords}
                                    options={{
                                        draggable: isAddingPolygon,
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


                    {/* Отображение выбранного полигона */}
                    {selectedPolygonCoords && selectedPolygonCoords.length > 0 && (
                        <>
                            <Polygon
                                geometry={[selectedPolygonCoords]}
                                options={{
                                    fillColor: '#666666',
                                    strokeColor: '#000000',
                                    opacity: 0.5,
                                    strokeWidth: 3,
                                }}
                            />
                            {selectedPolygonCoords.map((coords, index) => (
                                <Placemark
                                    key={`selected-${index}`}
                                    geometry={coords}
                                    options={{
                                        draggable: false, // Точки не перемещаемы
                                        preset: 'islands#circleIcon',
                                        iconColor: '#000000',
                                    }}
                                />
                            ))}
                        </>
                    )}


                    <Button
                        data={{ content: 'Мои полигоны' }}
                        options={{
                            maxWidth: 200,
                            position: { top: '10px', left: '10px' }
                        }}
                        onClick={() => setIsSidebarOpen(true)}
                    />
                </Map>

                {isSidebarOpen && (
                    <div className="sidebar">
                        <div className="sidebar-header">
                            <span>{username}</span>
                            <button
                                className="close-btn"
                                onClick={() => {
                                    setIsSidebarOpen(false);
                                    setIsAddingPolygon(false);
                                    setPolygonCoordinates([]);
                                    setPolygonName('');
                                    setSelectedPolygonCoords(null); // Очищаем выбранный полигон при закрытии
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <div className="add-polygon-section">
                            {!isAddingPolygon ? (
                                <button
                                    className="add-polygon-btn"
                                    onClick={handleAddPolygon}
                                >
                                    Добавить полигон
                                </button>
                            ) : (
                                <>
                                    <input
                                        type="text"
                                        value={polygonName}
                                        onChange={(e) => setPolygonName(e.target.value)}
                                        placeholder="Название полигона"
                                        className="polygon-name-input"
                                    />
                                    <button
                                        className="save-polygon-btn"
                                        onClick={() => handleSavePolygon(polygonCoordinates)}
                                    >
                                        Сохранить полигон
                                    </button>
                                </>
                            )}
                        </div>

                        <div className="polygons-list">
                            {polygons.map((polygon) => (
                                <div
                                    key={polygon.id}
                                    className="polygon-item"
                                    onClick={() => handlePolygonSelect(polygon.id)}
                                >
                                    <span
                                        className="polygon-name"
                                    >
                                        {polygon.name}
                                    </span>
                                    <span>{new Date(polygon.created_at).toLocaleDateString()} {new Date(polygon.created_at).toLocaleTimeString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </YMaps>
    );
};

export default Main;