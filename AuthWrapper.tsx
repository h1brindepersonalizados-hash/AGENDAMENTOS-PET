
import React from 'react';
import App from './App';
import Login from './Login';
import usePersistentState from './hooks/usePersistentState';

const AuthWrapper: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = usePersistentState('isAuthenticated', false);

    if (!isAuthenticated) {
        return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
    }

    return <App onLogout={() => setIsAuthenticated(false)} />;
}

export default AuthWrapper;
