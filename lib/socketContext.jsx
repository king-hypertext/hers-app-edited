import React, { createContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { api } from './api';

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const socket = io(api);
        setSocket(socket);

        // Cleanup on component unmount
        // return () => {
        //     socket.disconnect();
        // };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

export { SocketContext, SocketProvider };