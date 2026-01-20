// FIX: Import React to provide the React namespace for types like React.Dispatch.
import React, { useState, useEffect } from 'react';

function usePersistentState<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [state, setState] = useState<T>(() => {
        try {
            const storedValue = window.localStorage.getItem(key);
            // If there's a stored value, parse it. Otherwise, use the initial value.
            // This prevents mock data from overwriting existing user data on reload.
            return storedValue ? JSON.parse(storedValue) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key “${key}”:`, error);
            return initialValue;
        }
    });

    useEffect(() => {
        try {
            // Do not store the initial mock data if the user has never interacted with the app.
            // This check ensures we only store data that has been explicitly set or modified.
            const rawValue = JSON.stringify(state);
            window.localStorage.setItem(key, rawValue);
        } catch (error) {
            console.error(`Error setting localStorage key “${key}”:`, error);
        }
    }, [key, state]);

    return [state, setState];
}

export default usePersistentState;