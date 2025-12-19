import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../css/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleLogin = async (e) => {
    e.preventDefault();

    const requestBody = new URLSearchParams();
    requestBody.append('username', email);
    requestBody.append('password', password);

    try {
      const response = await axios.post(`http://${window.location.hostname}:8003/auth/jwt/login`, requestBody, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      console.log('Login successful:', response.status);

      const token = response.data.access_token;
      const decodedToken = JSON.parse(atob(token.split('.')[1]));

      sessionStorage.setItem('authToken', response.data.access_token);
      sessionStorage.setItem('userId', decodedToken.sub);
      sessionStorage.setItem('groupId', decodedToken.group_id);

      window.location.replace('/');
    } catch (error) {
      const errorData = error.response.data;
      const errorDetails = {};
      if (errorData.detail === "LOGIN_BAD_CREDENTIALS") {
        errorDetails['email'] = 'Неверный логин или пароль';
        errorDetails['password'] = 'Неверный логин или пароль';
      }
      setErrors(errorDetails);
    }

  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Вход</h1>

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
            {errors && (
              <p style={{color: 'red'}}>{errors['email']}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              id="password"
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors && (
              <p style={{color: 'red'}}>{errors['password']}</p>
            )}
            <div className="forgot-password">
              <Link to="/forgot-password">Забыли пароль?</Link>
            </div>
          </div>

          <button type="submit" className="login-button" onClick={handleLogin}>
            Войти
          </button>
        </form>

        <p className="signup-text">
          Еще не имеете аккаунта?{" "}
          <Link to="/register">Зарегистрируйтесь!</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;