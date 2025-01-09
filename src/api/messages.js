import {fetchWithAuth} from "./api.js";
import {API_BASE_URL} from "./api.js";

export async function sendMessage(messageData) {
    const url = `${API_BASE_URL}/api/messages/`;

    const body = new FormData();
    if (messageData.text) body.append('text', messageData.text);
    if (messageData.voice) body.append('voice', messageData.voice);
    body.append('chat', messageData.chatId);

    if (messageData.files && messageData.files.length > 0) {
        messageData.files.forEach((file) => {
            body.append('files', file);
        });
    }

    const response = await fetchWithAuth(url, {
        method: 'POST',
        body,
    });

    if (!response.ok) {
        throw new Error('Не удалось отправить сообщение');
    }

    return await response.json();
}

export async function getMessages(chatId, params) {
    const options = new URLSearchParams();
    options.append('chat', `${chatId}`);
    if (params.search) options.append('search', `${params.search}`);
    if (params.page_size) options.append('page_size', `${params.page_size}`);
    if (params.page ) options.append('page ', `${params.page }`);
    const url = `${API_BASE_URL}/api/messages/?${options.toString()}`;

    const response = await fetchWithAuth(url);

    if (!response.ok) {
        throw new Error('Не удалось получить сообщения');
    }

    return await response.json();
}

export async function getMessage(messageId) {
    const url = `${API_BASE_URL}/api/message/${messageId}`;

    const response = await fetchWithAuth(url);

    if (!response.ok) {
        throw new Error('Не удалось получить сообщения');
    }

    return await response.json();
}

export async function editMessageApi(messageId, text) {
    const url = `${API_BASE_URL}/api/message/${messageId}`;
    const body = new FormData();
    if (text) body.append('text', text);
    console.log({text, body});

    const response = await fetchWithAuth(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({text})
    });

    if (!response.ok) {
        let errorMessage = 'Не удалось обновить сообщение';
        try {
            const errorData = await response.json();
            errorMessage = errorData.detail || errorMessage;
            console.error({errorMessage});
        } catch (e) {
            throw new Error(e)
        }
        throw new Error(errorMessage);
    }

    return await response.json();
}

export async function deleteMessageApi(messageId) {
    const url = `${API_BASE_URL}/api/message/${messageId}`;

    const response = await fetchWithAuth(url, {
        method: 'DELETE',
    });

    if (!response.ok) {
        let errorMessage = 'Не удалось удалить сообщение';
        try {
            const errorData = await response.json();
            errorMessage = errorData.detail || errorMessage;
        } catch (e) {
            throw new Error(e)
        }
        throw new Error(errorMessage);
    }

}

export async function readMessage(messageId) {
    const url = `${API_BASE_URL}/api/message/${messageId}/read/`;

    const response = await fetchWithAuth(url, {
        method: 'POST',
    });

    if (!response.ok) {
        let errorMessage = 'Не удалось удалить сообщение';
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

