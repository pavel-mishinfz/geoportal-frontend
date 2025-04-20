import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MapComponent from '../components/MapComponent';
import Sidebar from '../components/Sidebar';
import Modal from '../components/Modal';
import '../css/Main.css';

const Main = () => {
    const username = 'Username';
    const userId = '3fa85f64-5717-4562-b3fc-2c963f66afa6';

    const [polygonCoordinates, setPolygonCoordinates] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [polygons, setPolygons] = useState([]);
    const [isAddingPolygon, setIsAddingPolygon] = useState(false);
    const [polygonName, setPolygonName] = useState('');
    const [selectedPolygonCoords, setSelectedPolygonCoords] = useState(null);
    const [selectedPolygonId, setSelectedPolygonId] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

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
        if (!isAddingPolygon && !isEditing) return;
        const coords = e.get('coords');
        setPolygonCoordinates([...polygonCoordinates, coords]);
    };

    const handlePlacemarkDrag = (index, newCoords) => {
        const newCoordinates = [...polygonCoordinates];
        newCoordinates[index] = newCoords;
        setPolygonCoordinates(newCoordinates);
    };

    const handlePlacemarkDblClick = (index) => {
        if (!isAddingPolygon && !isEditing) return;
        const newCoordinates = polygonCoordinates.filter((_, i) => i !== index);
        setPolygonCoordinates(newCoordinates);
    };

    const handleMapDblClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleSavePolygon = async (coordinates, polygonId = null) => {
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
            if (polygonId) {
                await axios.put(`http://${process.env.REACT_APP_HOSTNAME}/areas/${polygonId}`, requestBody, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
                    },
                });
                setSelectedPolygonCoords(coordinates);
                setSelectedPolygonId(polygonId)
            } else {
                await axios.post(`http://${process.env.REACT_APP_HOSTNAME}/areas`, requestBody, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
                    },
                });
            }
            setPolygonCoordinates([]);
            setIsAddingPolygon(false);
            setIsEditing(false);
            setPolygonName('');
            //setSelectedPolygonId(null);
            //setSelectedPolygonCoords(null);
            setIsSidebarOpen(true);
            fetchPolygons();
        } catch (error) {
            console.error('Ошибка при сохранении полигона:', error);
        }
    };

    const handleAddPolygon = () => {
        setIsAddingPolygon(true);
        setSelectedPolygonCoords(null);
        setSelectedPolygonId(null);
    };

    const handlePolygonSelect = async (polygonId) => {
        try {
            const response = await axios.get(`http://${process.env.REACT_APP_HOSTNAME}/areas/${polygonId}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
                },
            });
            const polygon = response.data;
            const coords = polygon.geometry.coordinates[0].slice(0, -1);
            setSelectedPolygonCoords(coords);
            setSelectedPolygonId(polygonId);
            setPolygonCoordinates([]);
            setIsAddingPolygon(false);
            setIsEditing(false);
            setPolygonName(polygon.name);
        } catch (error) {
            console.error('Ошибка при загрузке полигона:', error);
        }
    };

    const handleEditPolygon = (polygonId) => {
        setIsEditing(true);
        setPolygonCoordinates(selectedPolygonCoords);
        setSelectedPolygonCoords(null);
    };

    const handleSaveEdit = async () => {
        await handleSavePolygon(polygonCoordinates, selectedPolygonId);
        setIsEditing(false);
        //setSelectedPolygonId(null);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setPolygonCoordinates([]);
        setSelectedPolygonCoords(null);
        setSelectedPolygonId(null);
    };

    const handleDeletePolygon = async () => {
        try {
            await axios.delete(`http://${process.env.REACT_APP_HOSTNAME}/areas/${selectedPolygonId}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
                },
            });
            setSelectedPolygonCoords(null);
            setSelectedPolygonId(null);
            fetchPolygons();
            setIsModalOpen(false); // Закрываем модальное окно после удаления
        } catch (error) {
            console.error('Ошибка при удалении полигона:', error);
        }
    };

    const handleAnalysis = async () => {
        const today = new Date();

        const rawStartDate = new Date(today);
        rawStartDate.setFullYear(today.getFullYear() - 1);
        const startDate = rawStartDate.toISOString().split('T')[0]; 

        const endDate = today.toISOString().split('T')[0];

        let requestBody = {
            id: selectedPolygonId,
            geometry_geojson: {
                type: "Polygon",
                coordinates: [
                    selectedPolygonCoords
                ]
            },
            date_start: startDate, // "2024-06-01"
            date_end: endDate, // "2024-09-01"
            resolution: 10
        }

        try {
            const response = await axios.post(`http://localhost:8007/images`, requestBody, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
                },
            });
            
            const listImagesInfo = response.data;
            requestBody = {
                images_ids: listImagesInfo.map(item => item.id),
                images_paths: listImagesInfo.map(item => item.url)
            }
            await axios.post(`http://localhost:8009/analysis`, requestBody, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
                },
            });
        } catch (error) {
            console.error('Ошибка при загрузке снимков:', error);
        }
    };

    const openDeleteModal = () => {
        setIsModalOpen(true); // Открываем модальное окно
    };

    const closeModal = () => {
        setIsModalOpen(false); // Закрываем модальное окно
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
        setPolygonName('');
        setIsAddingPolygon(false);
        setIsEditing(false);
        setSelectedPolygonCoords(null);
        setSelectedPolygonId(null);
    };

    return (
        <div style={{ position: 'relative' }}>
            <MapComponent
                polygonCoordinates={polygonCoordinates}
                selectedPolygonCoords={selectedPolygonCoords}
                isAddingPolygon={isAddingPolygon}
                isEditing={isEditing}
                handleMapClick={handleMapClick}
                handleMapDblClick={handleMapDblClick}
                handlePlacemarkDrag={handlePlacemarkDrag}
                handlePlacemarkDblClick={handlePlacemarkDblClick}
                setIsSidebarOpen={setIsSidebarOpen}
            />
            <Sidebar
                username={username}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                isAddingPolygon={isAddingPolygon}
                isEditing={isEditing}
                closeSidebar={closeSidebar}
                polygonName={polygonName}
                setPolygonName={setPolygonName}
                polygons={polygons}
                selectedPolygonId={selectedPolygonId}
                handleAddPolygon={handleAddPolygon}
                handleSavePolygon={handleSavePolygon}
                handlePolygonSelect={handlePolygonSelect}
                handleEditPolygon={handleEditPolygon}
                handleSaveEdit={handleSaveEdit}
                handleCancelEdit={handleCancelEdit}
                handleDeletePolygon={openDeleteModal}
                handleAnalysis={handleAnalysis}
                polygonCoordinates={polygonCoordinates}
            />
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                onConfirm={handleDeletePolygon}
                message={`Вы уверены, что хотите удалить полигон ${polygonName}?`}
            />
        </div>
    );
};

export default Main;