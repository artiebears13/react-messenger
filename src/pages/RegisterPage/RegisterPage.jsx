// src/pages/RegisterPage/RegisterPage.jsx

import React, { useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fetchCurrentUser, login as loginAction } from '../../store/userSlice';
import { login as apiLogin, register } from '../../api/api';
import classes from './RegisterPage.module.scss';
import { ProfilePhoto } from '../../components/EditableFields/ProfilePhoto/ProfilePhoto.jsx';

function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        first_name: '',
        last_name: '',
        bio: '',
        avatar: null,
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const avatarInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(formData); // Регистрация пользователя
            const { access, refresh } = await apiLogin(formData.username, formData.password); // Логин после регистрации
            dispatch(loginAction({ accessToken: access, refreshToken: refresh })); // Сохраняем токены в Redux
            await dispatch(fetchCurrentUser()); // Загружаем текущего пользователя
            navigate('/'); // Перенаправляем на главную страницу
        } catch (err) {
            setError('Ошибка при регистрации. Пожалуйста, попробуйте снова.');
            console.error('Ошибка при регистрации:', err);
        }
    };

    return (
        <div className={classes.registerPage}>
            <h2>Регистрация</h2>
            {error && <p className="error">{error}</p>}
            <form
                className={classes.registerForm}
                onSubmit={handleSubmit}
                encType="multipart/form-data"
            >
                <input
                    type="text"
                    name="username"
                    placeholder="Логин"
                    value={formData.username}
                    onChange={handleChange}
                    className={classes.registerFormInput}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Пароль"
                    value={formData.password}
                    onChange={handleChange}
                    className={classes.registerFormInput}
                    required
                />
                <input
                    type="text"
                    name="first_name"
                    placeholder="Имя"
                    value={formData.first_name}
                    onChange={handleChange}
                    className={classes.registerFormInput}
                    required
                />
                <input
                    type="text"
                    name="last_name"
                    placeholder="Фамилия"
                    value={formData.last_name}
                    onChange={handleChange}
                    className={classes.registerFormInput}
                    required
                />
                <textarea
                    name="bio"
                    placeholder="О себе"
                    value={formData.bio}
                    onChange={handleChange}
                    className={classes.registerFormInput}
                />
                <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                    onChange={handleChange}
                    ref={avatarInputRef}
                    style={{ display: 'none' }}
                />
                <ProfilePhoto person={formData} setPerson={setFormData} />
                <button type="submit" className={classes.registerFormButton}>
                    Зарегистрироваться
                </button>
            </form>
            <p>
                Уже есть аккаунт? <Link to="/login">Войти</Link>
            </p>
        </div>
    );
}

export default RegisterPage;
