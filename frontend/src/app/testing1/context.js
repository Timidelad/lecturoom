"use client";

import { useState, createContext, useContext } from "react";

const AppContext = createContext(null);

export default function AppProvider({ children }) {
    const [user, setUser] = useState(null);
    const value = { user, setUser }
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext() {
    return useContext(AppContext)
}