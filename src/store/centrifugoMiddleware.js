// src/store/centrifugoMiddleware.js

import {receiveMessage, updateMessage, deleteMessageLocal} from './messageSlice';
import {connectToCentrifugo} from "../api/centrifugo.js";

export const centrifugoMiddleware = (storeAPI) => {
    let centrifuge = null;

    return (next) => (action) => {
        const result = next(action);

        if (action.type === 'user/fetchCurrentUser/fulfilled') {
            const userId = action.payload.id;

            centrifuge = connectToCentrifugo(userId, (event, data) => {
                handleCentrifugoEvent(storeAPI, event, data);
            });
        }

        if (action.type === 'user/logout' || action.type === 'user/login/rejected') {
            if (centrifuge) {
                centrifuge.disconnect();
                centrifuge = null;
            }
        }

        return result;
    };
};

const handleCentrifugoEvent = (storeAPI, event, data) => {
    if (event === 'create') {
            storeAPI.dispatch(receiveMessage({ chatId: data.chat, message: data }));
    } else if (event === 'update') {
            storeAPI.dispatch(updateMessage({ chatId: data.chat, message: data }));
    } else if (event === 'delete') {
            storeAPI.dispatch(deleteMessageLocal({ chatId: data.chat, messageId: data.id }));
    } else if (event === 'read') {
        storeAPI.dispatch(updateMessage({ chatId: data.chat, message: data }));
    }
};
