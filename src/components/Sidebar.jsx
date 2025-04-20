import React from 'react';
import PolygonItem from './PolygonItem';

const Sidebar = ({
    username,
    isSidebarOpen,
    setIsSidebarOpen,
    isAddingPolygon,
    isEditing,
    closeSidebar,
    polygonName,
    setPolygonName,
    polygons,
    selectedPolygonId,
    handleAddPolygon,
    handleSavePolygon,
    handlePolygonSelect,
    handleEditPolygon,
    handleSaveEdit,
    handleCancelEdit,
    handleDeletePolygon,
    handleAnalysis,
    polygonCoordinates,
}) => {
    if (!isSidebarOpen) return null;

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <span>{username}</span>
                <button
                    className="close-btn"
                    onClick={() => closeSidebar()}
                >
                    ×
                </button>
            </div>

            <div className="add-polygon-section">
                {!isAddingPolygon ? (
                    <button className="add-polygon-btn" onClick={handleAddPolygon}>
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
                    <PolygonItem
                        key={polygon.id}
                        polygon={polygon}
                        isSelected={selectedPolygonId === polygon.id}
                        isEditing={isEditing}
                        polygonName={polygonName}
                        setPolygonName={setPolygonName}
                        handlePolygonSelect={handlePolygonSelect}
                        handleEditPolygon={handleEditPolygon}
                        handleSaveEdit={handleSaveEdit}
                        handleCancelEdit={handleCancelEdit}
                        handleDeletePolygon={handleDeletePolygon}
                        handleAnalysis={handleAnalysis}
                    />
                ))}
            </div>
        </div>
    );
};

export default Sidebar;