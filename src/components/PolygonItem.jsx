import React, { useState, useEffect } from 'react';
import Loader from './Loader';

const PolygonItem = ({
    polygon,
    isSelected,
    isEditing,
    polygonName,
    polygonImagesCache,
    setPolygonName,
    handlePolygonSelect,
    handleEditPolygon,
    handleSaveEdit,
    handleCancelEdit,
    handleDeletePolygon,
    handleAnalysis,
    handlePreview,
    handleShowSavedImages
}) => {
    // Получаем текущую дату
    const today = new Date();

    // Вычисляем дату год назад
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    // Форматируем даты в строку в формате YYYY-MM-DD
    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    const [startDate, setStartDate] = useState(formatDate(oneYearAgo));
    const [endDate, setEndDate] = useState(formatDate(today));
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingPreview, setIsLoadingPreview] = useState(false);

    useEffect(() => {
        if (polygonImagesCache[polygon.id]) {
            setIsLoading(false);
        } else {
            setIsLoading(true);
        }
    }, [polygonImagesCache, polygon.id]);

    return (
        <>
            <div
                className={`polygon-item ${isSelected ? 'selected' : ''}`}
                onClick={() => handlePolygonSelect(polygon.id)}
            >
                <div className="polygon-label">
                    {isSelected && isEditing ? (
                        <input
                            type="text"
                            value={polygonName}
                            onChange={(e) => setPolygonName(e.target.value)}
                            placeholder="Название полигона"
                            className="polygon-name-input"
                            onClick={(e) => e.stopPropagation()}
                        />
                    ) : (
                        <span className="polygon-name">{polygon.name}</span>
                    )}
                    <span>{new Date(polygon.created_at).toLocaleDateString()} {new Date(polygon.created_at).toLocaleTimeString()}</span>
                </div>

                {isSelected && (
                    <div className="polygon-controls">
                        {!isEditing ? (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditPolygon(polygon.id);
                                    }}
                                    className="control-btn"
                                >
                                    <img src="/assets/pencil.svg" alt="Edit" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeletePolygon(polygon.id);
                                    }}
                                    className="control-btn"
                                >
                                    <img src="/assets/trash.svg" alt="Delete" />
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSaveEdit();
                                    }}
                                    className="control-btn"
                                >
                                    <img src="/assets/save.svg" alt="Save" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCancelEdit();
                                    }}
                                    className="control-btn"
                                >
                                    <img src="/assets/cancel.svg" alt="Cancel" />
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
            {isSelected && (

                <div className='polygon-footer'>
                    <div className='polygon-footer__date'>

                        <div className="date-field">
                            <label htmlFor="start-date">Дата начала</label>
                            <input
                                id="start-date"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="styled-date-input"
                            />
                        </div>

                        <div className="date-field">
                            <label htmlFor="end-date">Дата окончания</label>
                            <input
                                id="end-date"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="styled-date-input"
                            />
                        </div>

                    </div>
                    {isLoading ? (
                        <Loader />
                    ) : polygonImagesCache[polygon.id]?.length > 0 ? (
                        <>
                            <div className='polygon-footer__preview'>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleShowSavedImages();
                                    }}
                                    className='preview-btn'
                                >
                                    Показать снимки
                                </button>
                            </div>
                            <div className='polygon-analysis'>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAnalysis();
                                    }}
                                    className='analysis-btn'
                                >
                                    Проанализировать
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className='polygon-footer__preview'>
                            <button
                                onClick={async (e) => {
                                    e.stopPropagation();
                                    setIsLoadingPreview(true);
                                    await handlePreview(startDate, endDate);
                                    setIsLoadingPreview(false);
                                }}
                                className='preview-btn'
                            >
                                {isLoadingPreview ? (
                                    <Loader />
                                ) : (
                                    'Предпросмотр снимков'
                                )}
                            </button>
                        </div>
                    )}  

                </div>
            )}
        </>
    );
};

export default PolygonItem;