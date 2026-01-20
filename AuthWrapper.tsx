
import React, { useState } from 'react';
import App from './App';
import Login from './Login';
import Register from './Register';
import usePersistentState from './hooks/usePersistentState';

type AuthView = 'login' | 'register';

const AuthWrapper: React.FC = () => {
    const [currentUser, setCurrentUser] = usePersistentState<string | null>('currentUser', null);
    const [authView, setAuthView] = useState<AuthView>('login');

    if (!currentUser) {
        if (authView === 'login') {
            return <Login onLoginSuccess={(email) => setCurrentUser(email)} onNavigateToRegister={() => setAuthView('register')} />;
        }
        return <Register onRegisterSuccess={(email) => {
            setCurrentUser(email);
            setAuthView('login');
        }} onNavigateToLogin={() => setAuthView('login')} />;
    }

    return <App currentUser={currentUser} onLogout={() => setCurrentUser(null)} />;
}

export default AuthWrapper;
