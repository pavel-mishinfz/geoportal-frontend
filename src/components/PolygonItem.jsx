import React from 'react';

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
    handleAnalysis
}) => {
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
            )}
        </>
    );
};

export default PolygonItem;