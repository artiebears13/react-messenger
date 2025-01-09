// src/store/messageSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {getMessages, sendMessage, readMessage, deleteMessageApi, editMessageApi} from '../api/messages.js';

export const fetchMessages = createAsyncThunk(
    'messages/fetchMessages',
    async (chatId, { rejectWithValue }) => {
        try {
            const messagesData = await getMessages(chatId, { page_size: 20, page: 1 });
            return { chatId, messages: messagesData.results || messagesData };
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const sendNewMessage = createAsyncThunk(
    'messages/sendNewMessage',
    async ({ chatId, messageData }, { rejectWithValue }) => {
        try {
            const newMessage = await sendMessage({
                chatId,
                ...messageData,
            });
            return { chatId, message: newMessage };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const markMessagesAsRead = createAsyncThunk(
    'messages/markMessagesAsRead',
    async (chatId, { getState, dispatch, rejectWithValue }) => {
        try {
            const state = getState();
            const userId = state.user.user.id;
            const messages = state.messages.messages[chatId] || [];

            for (const message of messages) {
                if (
                    message.sender.id !== userId &&
                    !message.was_read_by.some((reader) => reader.id === userId)
                ) {
                    await dispatch(markMessageAsRead({ messageId: message.id, chatId })).unwrap();
                }
            }
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteMessage = createAsyncThunk(
    'messages/deleteMessage',
    async ({ chatId, messageId }, { rejectWithValue }) => {
        try {
            await deleteMessageApi(messageId);
            return { chatId, messageId };
        } catch (error) {
            if (error.response?.status === 404) {
                return { chatId, messageId };
            }
            return rejectWithValue({
                status: error.response?.status,
                data: error.response?.data || error.message
            });
        }
    }
);

export const editMessage = createAsyncThunk(
    'messages/editMessage',
    async ({ chatId, messageId, messageData }, { rejectWithValue }) => {
        try {
            console.log("dispatch", {messageId, messageData});
            const message = await editMessageApi(messageId, messageData.text);
            return {chatId, message};
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const markMessageAsRead = createAsyncThunk(
    'messages/markMessageAsRead',
    async ({ messageId, chatId }, { rejectWithValue }) => {
        try {
            const updatedMessage = await readMessage(messageId);
            return { chatId, message: updatedMessage };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const messageSlice = createSlice({
    name: 'messages',
    initialState: {
        messages: {}, // { chatId: [messages] }
        status: 'idle',
        error: null,
        foundMessage: '',
    },
    reducers: {
        setFoundMessage: (state, action) => {
            state.foundMessage = action.payload;
        },
        receiveMessage: (state, action) => {
            const { chatId, message } = action.payload;
            if (!state.messages[chatId]) {
                state.messages[chatId] = [];
            }
            const messageExists = state.messages[chatId].some((msg) => msg.id === message.id);
            if (!messageExists) {
                state.messages[chatId].unshift(message);
            }
        },
        updateMessage: (state, action) => {
            const { chatId, message } = action.payload;
            state.messages[chatId] = state.messages[chatId].map((msg) =>
                msg.id === message.id ? message : msg
            );
        },
        deleteMessageLocal: (state, action) => {
            const { chatId, messageId } = action.payload;
            state.messages[chatId] = state.messages[chatId].filter((msg) => msg.id !== messageId);
        },
        removeMessage: (state, action) => {
            const { chatId, messageId } = action.payload;
            if (state.messages[chatId]) {
                state.messages[chatId] = state.messages[chatId].filter((msg) => msg.id !== messageId);
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchMessages
            .addCase(fetchMessages.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.messages[action.payload.chatId] = action.payload.messages;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // sendNewMessage
            .addCase(sendNewMessage.fulfilled, (state, action) => {
                const { chatId, message } = action.payload;
                if (!state.messages[chatId]) {
                    state.messages[chatId] = [];
                }
                const messageExists = state.messages[chatId].some((msg) => msg.id === message.id);

                if (!messageExists) {
                    state.messages[chatId].unshift(message);
                }
            })
            // markMessageAsRead
            .addCase(markMessageAsRead.fulfilled, (state, action) => {
                const { chatId, message } = action.payload;
                state.messages[chatId] = state.messages[chatId].map((msg) =>
                    msg.id === message.id ? message : msg
                );
            })
            // deleteMessage
            .addCase(deleteMessage.fulfilled, (state, action) => {
                const { chatId, messageId } = action.payload;
                console.log("=============");
                if (state.messages[chatId]) {
                    state.messages[chatId] = state.messages[chatId].filter((msg) => msg.id !== messageId);
                }
            })
            .addCase(editMessage.fulfilled, (state, action) => {
                const { chatId, message } = action.payload;
                if (state.messages[chatId]) {
                    const index = state.messages[chatId].findIndex((msg) => msg.id === message.id);
                    if (index !== -1) {
                        state.messages[chatId][index] = message;
                    }
                }
            })
    },
});

export const { setFoundMessage, receiveMessage, updateMessage, deleteMessageLocal, removeMessage } = messageSlice.actions;
export default messageSlice.reducer;
