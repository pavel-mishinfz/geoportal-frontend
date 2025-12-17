import React, { useState } from "react";
import axios from "axios";
import "../css/Login.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [textBtn, setTextBtn] = useState('Отправить письмо');
  const [modify, setModify] = useState('');

  const handleRequestResetTokenPassword = async (e) => {
    e.preventDefault();
    const requestBody = {
      email: email
    };

    axios.post(`http://${window.location.hostname}:8003/auth/forgot-password`, requestBody)
      .then(response => {
        setTextBtn('Сообщение успешно отправлено!');
        setModify('sended-btn');
        setTimeout(function () {
          setTextBtn('Отправить письмо');
          setModify('');
        }, 3000);

        console.log('Request reset token passwrod successful:', response.status);
      })
      .catch(error => {
        console.error('Request reset token passwrod  failed:', error);
      });
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Сброс пароля</h1>

        <form className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Введите email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={`login-button ${modify}`} onClick={handleRequestResetTokenPassword}>
            {textBtn}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;