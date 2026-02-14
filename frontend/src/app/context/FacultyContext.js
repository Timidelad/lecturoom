"use client";
import { useState, createContext, useContext } from "react";

const FacultyContext = createContext(null);
export default function FacultyProvider({ children }) {
    const [faculty, setFaculty] = useState(null);
    const value = { faculty, setFaculty }
    return (
        <FacultyContext.Provider value={value}>
            {children}
        </FacultyContext.Provider>
    )
}

export function useFacultyContext() {
    return useContext(FacultyContext)
}