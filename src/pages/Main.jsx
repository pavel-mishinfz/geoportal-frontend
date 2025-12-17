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
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [isShowImagesModalOpen, setIsShowImagesModalOpen] = useState(false);
    const [preview, setPreview] = useState('');
    const [polygonImagesCache, setPolygonImagesCache] = useState({});
    const [detectionResultsCache, setDetectionResultsCache] = useState({});
    const [savedImges, setSavedImages] = useState({});
    const [detections, setDetections] = useState([]);


    useEffect(() => {
        fetchPolygons();
    }, []);

    const fetchPolygons = async () => {
        try {
            const response = await axios.get(`http://${window.location.hostname}:8000/areas?user_id=${userId}`, {
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
                await axios.put(`http://${window.location.hostname}:8000/areas/${polygonId}`, requestBody, {
                    headers: {
                        Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
                    },
                });
                setSelectedPolygonCoords(coordinates);
                setSelectedPolygonId(polygonId)
            } else {
                await axios.post(`http://${window.location.hostname}:8000/areas`, requestBody, {
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

    const fetchImages = async (polygonId) => {
        if (polygonImagesCache[polygonId]) {
            return polygonImagesCache[polygonId];
        }

        try {
            const response = await axios.get(`http://${window.location.hostname}:8001/images?polygon_id=${polygonId}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
                },
            });
            const urlList = response.data.map(item => item.url);
            setPolygonImagesCache(prev => ({
                ...prev,
                [polygonId]: urlList,
            }));

            return urlList;
        } catch (error) {
            console.error('Ошибка при загрузке снимков для полигона:', error);
        }
    };

    const fetchDetectionResults = async (polygonId) => {
        if (detectionResultsCache[polygonId]) {
            return detectionResultsCache[polygonId];
        }

        try {
            const response = await axios.get(`http://${window.location.hostname}:8002/analysis?polygon_id=${polygonId}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
                },
            });
            const detectionResult = response.data;
            setDetectionResultsCache(prev => ({
                ...prev,
                [polygonId]: detectionResult,
            }));

            return detectionResult;
        } catch (error) {
            console.error('Ошибка при загрузке результатов анализа:', error);
        }
    };

    const handlePolygonSelect = async (polygonId) => {
        if (selectedPolygonId === polygonId) {
            setSelectedPolygonCoords(null);
            setSelectedPolygonId(null);
            setPolygonCoordinates([]);
            setIsAddingPolygon(false);
            setIsEditing(false);
            setPolygonName('');
            setDetections([]);
            return;
        }

        try {
            // Проверяем, есть ли снимки в кэше
            const cachedImages = polygonImagesCache[polygonId];
            // Проверяем, есть ли результат анализа в кэше
            const cachedResult = detectionResultsCache[polygonId];

            // Если нет — загружаем
            if (!cachedImages) {
                await fetchImages(polygonId);
            }
            if (!cachedResult) {
                await fetchDetectionResults(polygonId)
            }

            const response = await axios.get(`http://${window.location.hostname}:8000/areas/${polygonId}`, {
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
            await axios.delete(`http://${window.location.hostname}:8000/areas/${selectedPolygonId}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
                },
            });
            setSelectedPolygonCoords(null);
            setSelectedPolygonId(null);
            fetchPolygons();
            setIsDeleteModalOpen(false); // Закрываем модальное окно после удаления
        } catch (error) {
            console.error('Ошибка при удалении полигона:', error);
        }
    };

    const handleAnalysis = async () => {
        try {
            const images = await axios.get(`http://${window.location.hostname}:8001/images?polygon_id=${selectedPolygonId}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
                },
            });
            const listImagesInfo = images.data;
            const requestBody = {
                polygon_id: selectedPolygonId,
                images_ids: listImagesInfo.map(item => item.id),
                images_paths: listImagesInfo.map(item => item.url)
            }
            const analysisResults = await axios.post(`http://${window.location.hostname}:8002/analysis`, requestBody, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
                },
            });
            setDetectionResultsCache(prev => ({
                ...prev,
                [selectedPolygonId]: analysisResults.data,
            }))
        } catch (error) {
            console.error('Ошибка при попытке анализа снимков:', error);
        }
    };

    const handleShowAnalysisResult = async (polygonId) => {
        const result = detectionResultsCache[polygonId];
        setDetections(result);
    };

    const handlePreview = async (startDate, endDate) => {
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
            const response = await axios.post(`http://${window.location.hostname}:8001/images/preview`, requestBody, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
                },
            });

            setPreview(response.data);
            setIsPreviewModalOpen(true);
        } catch (error) {
            console.error('Ошибка при загрузке снимков:', error);
        }
    };

    const handleSavePreviewImages = async () => {
        try {
            const response = await axios.post(`http://${window.location.hostname}:8001/images/save?polygon_id=${selectedPolygonId}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
                },
            });
            const urlList = response.data.map(item => item.url);
            setPolygonImagesCache(prev => ({
                ...prev,
                [selectedPolygonId]: urlList,
            }));
            closeModal();
        } catch (error) {
            console.error('Ошибка при сохранении снимков:', error);
        }
    };

    const handleShowSavedImages = async () => {
        if (savedImges[selectedPolygonId]) {
            setIsShowImagesModalOpen(true);
            return;
        }

        try {
            const response = await axios.get(`http://${window.location.hostname}:8001/images?polygon_id=${selectedPolygonId}`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('authToken')}`,
                },
            });
            const savedImages = response.data.map(item => ({
                image_id: item.id,
                preview: convertLocalPathToUrl(item.url)
            }))
            setSavedImages(prev => ({
                ...prev,
                [selectedPolygonId]: savedImages,
            }));
            setIsShowImagesModalOpen(true);
        } catch (error) {
            console.error('Ошибка при получении снимков из БД:', error);
        }
    };

    const openDeleteModal = () => {
        setIsDeleteModalOpen(true); // Открываем модальное окно
    };

    const closeModal = () => {
        setIsDeleteModalOpen(false); // Закрываем модальное окно
        setIsPreviewModalOpen(false);
        setIsShowImagesModalOpen(false);
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
                detections={detections}
            />
            <Sidebar
                username={username}
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
                isAddingPolygon={isAddingPolygon}
                isEditing={isEditing}
                closeSidebar={closeSidebar}
                polygonName={polygonName}
                polygonImagesCache={polygonImagesCache}
                setPolygonName={setPolygonName}
                polygons={polygons}
                selectedPolygonId={selectedPolygonId}
                detectionResultsCache={detectionResultsCache}
                handleAddPolygon={handleAddPolygon}
                handleSavePolygon={handleSavePolygon}
                handlePolygonSelect={handlePolygonSelect}
                handleEditPolygon={handleEditPolygon}
                handleSaveEdit={handleSaveEdit}
                handleCancelEdit={handleCancelEdit}
                handleDeletePolygon={openDeleteModal}
                handleAnalysis={handleAnalysis}
                handlePreview={handlePreview}
                handleShowSavedImages={handleShowSavedImages}
                handleShowAnalysisResult={handleShowAnalysisResult}
                polygonCoordinates={polygonCoordinates}
            />

            <Modal
                title={'Сохраненные снимки'}
                isOpen={isShowImagesModalOpen}
                onClose={closeModal}
                onCloseTxt={'Закрыть'}
                onConfirm={null}
                images={savedImges[selectedPolygonId]}
            />

            <Modal
                title={'Предпросмотр снимков'}
                isOpen={isPreviewModalOpen}
                onClose={closeModal}
                onConfirm={handleSavePreviewImages}
                onConfirmTxt={'Сохранить снимки'}
                images={preview}
            />

            <Modal
                title={'Подтвердить удаление'}
                isOpen={isDeleteModalOpen}
                onClose={closeModal}
                onConfirm={handleDeletePolygon}
                message={`Вы уверены, что хотите удалить полигон ${polygonName}?`}
            />
        </div>
    );
};

export default Main;


const convertLocalPathToUrl = (localPath) => {
    const fileName = localPath.split(/[\\/]/).pop();
    return `http://${window.location.hostname}:8001/images/${fileName}`;
};