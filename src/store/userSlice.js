// src/store/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCurrentUser, updateUserInfo } from '../api/users.js';

export const fetchCurrentUser = createAsyncThunk(
    'user/fetchCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const userData = await getCurrentUser();
            return userData;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const updateUserProfile = createAsyncThunk(
    'user/updateUserProfile',
    async (updateData, { rejectWithValue }) => {
        try {
            const updatedUser = await updateUserInfo(updateData);
            return updatedUser;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

const initialState = {
    user: null,
    status: 'idle',
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action) => {
            localStorage.setItem('accessToken', action.payload.accessToken);
            localStorage.setItem('refreshToken', action.payload.refreshToken);
        },
        logout: (state) => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchCurrentUser
            .addCase(fetchCurrentUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload;
            })
            .addCase(fetchCurrentUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.user = action.payload;
            });
    },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
