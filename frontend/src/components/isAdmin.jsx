import { Navigate } from 'react-router-dom';

function IsAdmin({ children }) {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");

    if (!token) {
        return <Navigate to="/auth/login" replace />;
    }

    if (userRole !== "ROLE_ADMIN") {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default IsAdmin;