import React from "react";
import { Link } from "react-router-dom";
import "../css/Register.css";

const RegisterSuccess = () => {
  return (
    <div className="register-page">
      <div className="register-card">
        <div className="success-icon">
          <svg 
            width="64" 
            height="64" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="12" fill="#10B981"/>
            <path 
              d="M7 12L10 15L17 8" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
        
        <h1 className="register-title">Регистрация успешна!</h1>
        
        <p className="success-message">
          Ваша учетная запись была успешно создана.
          Теперь вы можете войти в систему, используя свои учетные данные.
        </p>

        <button className="register-button">
          <Link to="/login" className="register-button" style={{ textDecoration: 'none' }}>
            Перейти к авторизации
          </Link>
        </button>
      </div>
    </div>
  );
}

export default RegisterSuccess;