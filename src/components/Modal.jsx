import React from 'react';
import '../css/Modal.css'; // Подключаем стили для модального окна

const Modal = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <p>{message}</p>
                <div className="modal-buttons">
                    <button onClick={onConfirm} className="modal-btn confirm-btn">
                        Подтвердить
                    </button>
                    <button onClick={onClose} className="modal-btn cancel-btn">
                        Отмена
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;