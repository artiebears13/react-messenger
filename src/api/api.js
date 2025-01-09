export const API_BASE_URL =  'https://vkedu-fullstack-div2.ru';//'';// in local

export async function fetchWithAuth(url, options = {}) {
    let accessToken = localStorage.getItem('accessToken');

    const headers = {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`,
    };

    let response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
        const refreshTokenValue = localStorage.getItem('refreshToken');
        if (refreshTokenValue) {
            try {
                const newTokens = await refreshToken(refreshTokenValue);
                accessToken = newTokens.access;
                localStorage.setItem('accessToken', newTokens.access);
                localStorage.setItem('refreshToken', newTokens.refresh);

                headers['Authorization'] = `Bearer ${accessToken}`;
                response = await fetch(url, { ...options, headers });
            } catch {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                throw new Error('Сессия истекла, пожалуйста, войдите снова');
            }
        } else {
            throw new Error('Необходима авторизация');
        }
    }

    return response;
}

export async function register(userData) {
    const url = `${API_BASE_URL}/api/register/`;

    const body = new FormData();
    body.append('username', userData.username);
    body.append('password', userData.password);
    body.append('first_name', userData.first_name);
    body.append('last_name', userData.last_name);
    if (userData.bio) body.append('bio', userData.bio);
    if (userData.avatar) body.append('avatar', userData.avatar); // file

    const response = await fetch(url, {
        method: 'POST',
        body,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка при регистрации');
    }

    return await response.json();
}

export async function login(username, password) {
    const url = `${API_BASE_URL}/api/auth/`;

    const body = JSON.stringify({ username, password });

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body,
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Ошибка при авторизации');
    }

    return await response.json(); // return { access, refresh }
}

export async function refreshToken(refresh) {
    const url = `${API_BASE_URL}/api/auth/refresh/`;

    const body = JSON.stringify({ refresh });

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body,
    });

    if (!response.ok) {
        throw new Error('Не удалось обновить токен');
    }

    return await response.json(); // return { access, refresh }
}