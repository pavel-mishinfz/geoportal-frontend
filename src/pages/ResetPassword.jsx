import React, { useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "../css/Login.css";

const ResetPassword = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const token = searchParams.get('token');

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");


  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      let error_txt = 'Пароли должны совпадать';
      setError(error_txt);
      return;
    }

    const requestBody = {
      token: token,
      password: password
    };

    axios.post(`http://${window.location.hostname}:8003/auth/reset-password`, requestBody)
      .then(response => {
        console.log('Reset passwrod successful:', response.status);
        window.location.replace('/login');
      })
      .catch(error => {
        console.error('Reset passwrod  failed:', error);
      });
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Изменение пароля</h1>

        <form className="login-form">
          <>
            <div className="form-group">
              <label htmlFor="email">Новый пароль</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Подтверждение пароля</label>
              <input
                id="passwordConfirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {error && (
                <p style={{ color: 'red' }}>{error}</p>
              )}
            </div>
          </>

          <button type="submit" className="login-button" onClick={handleResetPassword}>
            Изменить пароль
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;