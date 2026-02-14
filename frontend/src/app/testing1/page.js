"use client";
import { useState, useContext, createContext } from "react";
import { useAppContext } from "./context";
// const userContext = createContext();
export default function TestingPage1() {
    const { user, setUser } = useAppContext();
    // const [user, setUser] = useState('timilehin');
    return (
        <div>
            <h1>Home</h1>
            {user ? (
                <div>hello {user}</div>
            ) : (
                <button onClick={() => setUser("segun")}>click</button>
            )}
        </div>
    )
}

function Component1() {
    // const user = useContext(userContext);
    return (
        <>
            <div>component 1</div>
            {/* <h1>my name is {user}</h1> */}
        </>
    )
}