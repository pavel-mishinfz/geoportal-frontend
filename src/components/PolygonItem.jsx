import React, { useState } from 'react';

const PolygonItem = ({
    polygon,
    isSelected,
    isEditing,
    polygonName,
    setPolygonName,
    handlePolygonSelect,
    handleEditPolygon,
    handleSaveEdit,
    handleCancelEdit,
    handleDeletePolygon,
    handleAnalysis,
    handlePreview
}) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');


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
                    <div className='polygon-footer__preview'>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handlePreview(startDate, endDate);
                            }}
                            className='preview-btn'
                        >
                            Предпросмотр снимков
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

                </div>
            )}
        </>
    );
};

export default PolygonItem;