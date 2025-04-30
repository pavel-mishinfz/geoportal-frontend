import React from 'react';
import '../css/Modal.css';

const Modal = ({
    title = 'Заголовок',
    isOpen,
    onClose,
    onCloseTxt = 'Отмена',
    onConfirm,
    onConfirmTxt = 'Подтвердить',
    message,
    images
}) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
            <h3 className='modal-header'>{title}</h3>
                {message && (
                    <p>{message}</p>
                )}
                {images && images.length > 0 && (
                    <div className="modal-images">
                        {images.map(({ image_id, preview }) => (
                            <img
                                key={image_id}
                                src={preview}
                                alt={`preview-${image_id}`}
                                className="preview-image"
                            />
                        ))}
                    </div>
                )}
                <div className="modal-buttons">
                    <button onClick={onConfirm} className="modal-btn confirm-btn">
                        {onConfirmTxt}
                    </button>
                    <button onClick={onClose} className="modal-btn cancel-btn">
                        {onCloseTxt}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;