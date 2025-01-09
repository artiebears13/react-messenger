// src/store/notificationMiddleware.js

import {markMessageAsRead} from "./messageSlice.js";

export const notificationMiddleware = (storeAPI) => (next) => (action) => {
    const result = next(action);

    if (action.type === 'messages/receiveMessage') {
        const { message } = action.payload;
        const state = storeAPI.getState();
        const currentChat = state.chats.currentChat;
        const user = state.user.user;
        if (user && user.id === message.sender.id) {
            return null;
        }

        if (currentChat && message.chat === currentChat.id) {
            storeAPI.dispatch(markMessageAsRead({ messageId: message.id, chatId: message.chat }));
        } else {
            if (Notification.permission === 'granted') {
                new Notification('Новое сообщение', {
                    body: `У вас новое сообщение от ${message.sender.first_name}: ${message.text}`,
                    icon: 'assets/notificationIcon',
                });
            }
        }
    }

    return result;
};
