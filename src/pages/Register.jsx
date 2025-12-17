import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../css/Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const errorDetails = {};

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      errorDetails['confirmPassword'] = 'Пароли должны совпадать';
      setErrors(errorDetails);
      return;
    }

    const requestBody = {
      email: formData.email,
      password: formData.password,
      is_active: true,
      is_superuser: false,
      is_verified: false,
      username: formData.username,
      group_id: 2,
    };

    axios.post('http://' + window.location.hostname + ':8003/auth/register', requestBody)
      .then(response => {
        console.log('Registration successful:', response.status);
        
        window.location.replace('/register-success');

      })
      .catch(error => {
        const errorData = error.response.data;
        if (errorData.detail === "REGISTER_USER_ALREADY_EXISTS") {
          errorDetails['email'] = 'Пользователь с такой почтой уже существует';
        } else if (errorData.detail.code === "REGISTER_INVALID_PASSWORD") {
          errorDetails['password'] = errorData.detail.reason;
        } else {
          errorData.detail.forEach((error) => {
            const field = error.loc[1];
            errorDetails[field] = error.msg.split(',')[1];
          });
        }
        setErrors(errorDetails);
      });
  };


  return (
    <div className="register-page">
      <div className="register-card">
        <h1 className="register-title">Регистрация</h1>

        <form className="register-form">
          <div className="form-group">
            <label htmlFor="username">Имя пользователя</label>
            <input
              id="username"
              type="text"
              placeholder="Введите имя"
              value={formData.username}
              onChange={handleChange}
              required
            />
            {errors && (
              <p style={{color: 'red'}}>{errors['username']}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Введите email"
              value={formData.email}
              onChange={handleChange}
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
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors && (
              <p style={{color: 'red'}}>{errors['password']}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Подтверждение пароля</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Повторите пароль"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {errors && (
              <p style={{color: 'red'}}>{errors['confirmPassword']}</p>
            )}
          </div>

          <button type="submit" className="register-button" onClick={handleRegister}>
            Зарегистрироваться
          </button>
        </form>

        <p className="login-text">
          Уже имеете аккаунт?{" "}
          <Link to={'/login'}>Авторизуйтесь!</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;