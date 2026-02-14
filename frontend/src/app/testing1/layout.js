"use client"

import AppProvider from "./context"

export default function TestingLayout({ children }) {
    return (
        <AppProvider>
            {children}
        </AppProvider>
    )
}