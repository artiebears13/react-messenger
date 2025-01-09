// src/pages/LoginPage/LoginPage.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchCurrentUser, login as loginAction } from '../../store/userSlice';
import { login as apiLogin } from '../../api/api';
import classes from './LoginPage.module.scss';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { access, refresh } = await apiLogin(username, password);
            dispatch(loginAction({ accessToken: access, refreshToken: refresh })); // Сохраняем токены в Redux
            await dispatch(fetchCurrentUser()); // Загружаем текущего пользователя
            navigate('/');
        } catch (err) {
            setError('Неверное имя пользователя или пароль');
            console.error('Ошибка при входе:', err);
        }
    };

    return (
        <div className={classes.loginPage}>
            <h2>Вход в систему</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit} className={classes.loginForm}>
                <input
                    type="text"
                    placeholder="Логин"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={classes.loginFormInput}
                    required
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={classes.loginFormInput}
                    required
                />
                <button type="submit" className={classes.loginFormButton}>Войти</button>
            </form>
            <p>
                Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
            </p>
        </div>
    );
}

export default LoginPage;
