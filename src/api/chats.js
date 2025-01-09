import {fetchWithAuth} from "./api.js";
import {API_BASE_URL} from "./api.js";
import {getCurrentUser} from "./users.js";

export async function getChats(page=1, pageSize=10, searchQuery=null) {

    const options = new URLSearchParams();
    options.append('page', `${page}`);
    options.append('page_size', `${pageSize}`);
    if (searchQuery) {
        options.append('search', searchQuery);
    }

    const url = `${API_BASE_URL}/api/chats/?${options.toString()}`;

    const response = await fetchWithAuth(url);

    if (!response.ok) {
        throw new Error('Не удалось получить список чатов');
    }

    return await response.json();
}

export async function createChat(chatData) {
    const url = `${API_BASE_URL}/api/chats/`;

    const body = new FormData();
    body.append('is_private', chatData.is_private);
    body.append('creator', chatData.creator);
    chatData.members.forEach((member) => body.append('members', member));
    if (chatData.title) body.append('title', chatData.title);
    if (chatData.avatar) body.append('avatar', chatData.avatar);

    const response = await fetchWithAuth(url, {
        method: 'POST',
        body,
    });

    if (!response.ok) {
        if (response.status === 400){
            if ((await response.json()).members){
                throw new Error("Чат с этим пользователем уже существует");
            }
        }
        throw new Error('Не удалось создать чат');
    }

    return await response.json();
}

export async function getChat(uuid) {
    const url = `${API_BASE_URL}/api/chat/${uuid}/`;

    const response = await fetchWithAuth(url);

    if (!response.ok) {
        throw new Error('Не удалось получить данные чата');
    }

    return await response.json();
}

export async function updateChatInfo(uuid, newData) {

    const url = `${API_BASE_URL}/api/chat/${uuid}/`;
    const prevChatInfo = await getChat(uuid);

    const formData = new FormData();
    if (newData.title !== undefined && prevChatInfo !== prevChatInfo.title ) {
        formData.append('title', newData.title);
    }
    if (newData.members !== undefined
        && newData.members.length > 0
    ) {
        formData.append('members', newData.members);
    }

    const response = await fetchWithAuth(url, {
        method: 'PATCH',
        body: formData,
    });

    if (!response.ok) {
        let errorMessage = 'Не удалось обновить данные чата';
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

export async function deleteChat(chat) {
    const currentUser = await getCurrentUser();
    const uuid = chat.id;

    if (!currentUser.id === chat.creator.id) {
        return ;
    }

    const url = `${API_BASE_URL}/api/chat/${uuid}/`;


    const response = await fetchWithAuth(url, {
        method: 'DELETE',
    });

    if (!response.ok) {
        let errorMessage = 'Не удалось удалить чат';
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