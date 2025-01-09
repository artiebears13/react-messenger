import {API_BASE_URL} from "./api.js";
import {fetchWithAuth} from "./api.js";

/*
{
  id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  username: "username",
  first_name: "string",
  last_name: "string",
  bio: "string" | null,
  avatar: "string" | null,
}
 */
export async function getCurrentUser() {
    const url = `${API_BASE_URL}/api/user/current/`;

    const response = await fetchWithAuth(url);

    if (!response.ok) {
        throw new Error('Не удалось получить данные пользователя');
    }

    return await response.json();
}

export async function getUserInfo(uuid) {
    const url = `${API_BASE_URL}/api/user/${uuid}/`;

    const response = await fetchWithAuth(url);

    if (!response.ok) {
        throw new Error('Не удалось получить данные пользователя');
    }

    return await response.json();
}

export async function updateUserInfo(updateData) {
    const currentUser = await getCurrentUser();
    const uuid = currentUser.id;

    const url = `${API_BASE_URL}/api/user/${uuid}/`;

    const formData = new FormData();
    if (updateData.bio !== undefined && updateData.bio !== currentUser.bio ) formData.append('bio', updateData.bio);
    if (updateData.avatar !== undefined && updateData.avatar !== currentUser.avatar) formData.append('avatar', updateData.avatar);

    const response = await fetchWithAuth(url, {
        method: 'PATCH',
        body: formData,
    });

    if (!response.ok) {
        let errorMessage = 'Не удалось обновить данные пользователя';
        try {
            const errorData = await response.json();
            errorMessage = errorData.detail || errorMessage;
        } catch (e) {
            throw new Error(e)
        }
        throw new Error(errorMessage);
    }

    return await response.json();
}

export async function deleteUserInfo() {
    const currentUser = await getCurrentUser();
    const uuid = currentUser.id;

    const url = `${API_BASE_URL}/api/user/${uuid}/`;


    const response = await fetchWithAuth(url, {
        method: 'DELETE',
    });

    if (!response.ok) {
        let errorMessage = 'Не удалось удалить данные пользователя';
        try {
            const errorData = await response.json();
            errorMessage = errorData.detail || errorMessage;
        } catch (e) {
            throw new Error(e)
        }
        throw new Error(errorMessage);
    }

    return await response.json();
}

export async function getUsers( page=1, pageSize=10, searchQuery=null) {
    const options = new URLSearchParams();
    options.append('page', `${page}`);
    options.append('page_size', `${pageSize}`);
    if (searchQuery) {
        options.append('search', searchQuery);
    }
    const url = `${API_BASE_URL}/api/users/?${options.toString()}`;
    const response = await fetchWithAuth(url);
    if (!response.ok) {
        throw new Error('Не удалось получить список чатов');
    }
    return await response.json();
}