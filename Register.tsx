
import React, { useState } from 'react';
import { PawPrint } from './components/Icons';

interface RegisterProps {
    onRegisterSuccess: (email: string) => void;
    onNavigateToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegisterSuccess, onNavigateToLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('As senhas não coincidem.');
            return;
        }
        if (password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        try {
            const users = JSON.parse(localStorage.getItem('petHotelUsers') || '{}');
            if (users[email]) {
                setError('Este e-mail já está cadastrado.');
                return;
            }

            users[email] = password;
            localStorage.setItem('petHotelUsers', JSON.stringify(users));
            setError('');
            onRegisterSuccess(email);

        } catch {
            setError('Ocorreu um erro ao criar a conta. Tente novamente.');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-slate-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <PawPrint className="w-16 h-16 mx-auto text-indigo-600" />
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        Crie sua Conta
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Comece a gerenciar seu hotel para pets hoje mesmo.
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleRegister}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Seu melhor e-mail"
                            />
                        </div>
                        <div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Crie uma senha forte"
                            />
                        </div>
                         <div>
                            <input
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Confirme sua senha"
                            />
                        </div>
                    </div>
                    
                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Criar Conta
                        </button>
                    </div>
                </form>
                 <p className="mt-4 text-center text-sm text-gray-600">
                    Já tem uma conta?{' '}
                    <button onClick={onNavigateToLogin} className="font-medium text-indigo-600 hover:text-indigo-500">
                        Faça login
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Register;
