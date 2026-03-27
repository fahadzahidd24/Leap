import { useEffect, useRef, useState, useCallback } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "https://leaptechsolutions.com";

let socketInstance;

const useSocket = () => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!socketInstance) {
      socketInstance = io(SOCKET_URL, {
        transports: ["websocket"],
        autoConnect: true,
      });

      socketInstance.on("connect", () => {
        console.log("Connected to socket server", socketInstance.id);
        setSocket(socketInstance); // Set the socket only after connection is established
      });

      socketInstance.on("disconnect", () => {
        console.log("Disconnected from socket server");
        setSocket(null);
      });
    } else {
      setSocket(socketInstance); // Use the existing socket instance
    }
  }, []);

  const sendEvent = useCallback(
    (eventName, data) => {
      if (socket && socket.connected) {
        socket.emit(eventName, data);
      } else {
        console.warn(`Cannot send event ${eventName}: socket not connected`);
      }
    },
    [socket]
  );

  const onEvent = useCallback(
    (eventName, callback) => {
      if (socket) {
        socket.on(eventName, callback);
      }

      return () => {
        if (socket) {
          socket.off(eventName, callback);
        }
      };
    },
    [socket]
  );

  return { socket, sendEvent, onEvent };
};

export default useSocket;
