import React, {useEffect} from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {useDispatch} from 'react-redux';
import { AlertMessage } from './components/Modals/AlertMessage/AlertMessage.jsx';
import { ChatListPage } from './pages/ChatList/ChatListPage.jsx';
import { PageChat } from './pages/PageChat/PageChat.jsx';
import { SelfProfilePage } from './pages/SelfProfilePage/SelfProfilePage.jsx';
import LoginPage from './pages/LoginPage/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage/RegisterPage.jsx';
import PrivateRoute from './components/PrivateRoute/PrivateRoute.jsx';
import {fetchCurrentUser} from "./store/userSlice.js";
import {UserProfilePage} from "./pages/UserProfilePage/UserProfilePage.jsx";
function App() {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);

    const dispatch = useDispatch();

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            dispatch(fetchCurrentUser());
        }
    }, [dispatch]);

    return (
                <Router>
                    <AlertMessage />
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <PrivateRoute>
                                    <ChatListPage />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/chat/:chatId"
                            element={
                                <PrivateRoute>
                                    <PageChat />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/user/:userId"
                            element={
                            <PrivateRoute>
                                <UserProfilePage />
                            </PrivateRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <PrivateRoute>
                                    <SelfProfilePage />
                                </PrivateRoute>
                            }
                        />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </Router>
    );
}

export default App;
