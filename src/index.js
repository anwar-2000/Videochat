import React from "react";
import  ReactDOM  from "react-dom/client";

import { ContextProvider } from "./SocketContext";
import App from "./App"

import "./styles.css"

ReactDOM.createRoot(document.getElementById('root')).render(
    <ContextProvider>
        <App />
    </ContextProvider>

);