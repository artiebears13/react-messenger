import React from 'react';
import { Navigate } from 'react-router-dom';
import {useSelector} from 'react-redux';


// eslint-disable-next-line react/prop-types
function PrivateRoute({ children }) {
    const user = useSelector((state) => state.user.user);
    const status = useSelector((state) => state.user.status);
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    if (status === 'loading' || status === 'idle') {
        return null;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default PrivateRoute;
