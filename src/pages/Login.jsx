import React, { useState } from "react";
import "../css/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Вход</h1>

        <form className="login-form" onSubmit={handleSubmit}>
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
            <div className="forgot-password">
              <a href="#">Забыли пароль?</a>
            </div>
          </div>

          <button type="submit" className="login-button">
            Войти
          </button>
        </form>

        <p className="signup-text">
          Еще не имеете аккаунта?{" "}
          <a href="/register">Зарегистрируйтесь!</a>
        </p>
      </div>
    </div>
  );
}

export default Login;