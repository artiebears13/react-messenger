// src/store/chatSlice.js
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit';
import {getChat, getChats} from '../api/chats.js';
import {sendNewMessage, receiveMessage, updateMessage, deleteMessage} from './messageSlice';

export const fetchChats = createAsyncThunk(
    'chats/fetchChats',
    async (_, {rejectWithValue}) => {
        try {
            const chatsData = await getChats();
            return chatsData.results || chatsData;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const searchChats = createAsyncThunk(
    'chats/searchChats',
    async (query, {rejectWithValue}) => {
        try {
            const chatsData = await getChats(1, 10, query);
            return chatsData.results || chatsData;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const fetchCurrentChat = createAsyncThunk(
    'chats/fetchCurrentChat',
    async (chatId, {rejectWithValue}) => {
        try {
            const chatData = await getChat(chatId);
            return chatData;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const chatSlice = createSlice({
    name: 'chats',
    initialState: {
        chats: [],
        status: 'idle',
        error: null,
        currentChat: null,
    },
    reducers: {
        setCurrentChat: (state, action) => {
            state.currentChat = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchChats
            .addCase(fetchChats.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchChats.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.chats = action.payload;
            })
            .addCase(fetchChats.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // searchChats
            .addCase(searchChats.fulfilled, (state, action) => {
                state.chats = action.payload;
            })
            .addCase(fetchCurrentChat.fulfilled, (state, action) => {
                state.currentChat = action.payload;
            })
            .addCase(sendNewMessage.fulfilled, (state, action) => {
                const {chatId, message} = action.payload;
                const chatIndex = state.chats.findIndex((chat) => chat.id === chatId);
                if (chatIndex !== -1) {
                    state.chats[chatIndex].last_message = message;
                    const chat = state.chats.splice(chatIndex, 1)[0];
                    state.chats.unshift(chat);
                }
            })
            .addCase(receiveMessage.type, (state, action) => {
                const {chatId, message} = action.payload;
                const chatIndex = state.chats.findIndex((chat) => chat.id === chatId);
                if (chatIndex !== -1) {
                    state.chats[chatIndex].last_message = message;
                    const chat = state.chats.splice(chatIndex, 1)[0];
                    state.chats.unshift(chat);
                }
            })
            .addCase(updateMessage.type, (state, action) => {
                const {chatId, message} = action.payload;
                const chatIndex = state.chats.findIndex((chat) => chat.id === chatId);
                if (chatIndex !== -1) {
                    state.chats[chatIndex].last_message = message;
                }
            })
            .addCase(deleteMessage.fulfilled, (state, action) => {
                const { chatId, messageId } = action.payload;
                const chatIndex = state.chats.findIndex((chat) => chat.id === chatId);
                if (chatIndex !== -1) {
                    const lastMessage = state.chats[chatIndex].last_message;
                    if (lastMessage && lastMessage.id === messageId) {
                        state.chats[chatIndex].last_message = null;
                    }
                }
            });
    },
});

export const {setCurrentChat} = chatSlice.actions;
export default chatSlice.reducer;
