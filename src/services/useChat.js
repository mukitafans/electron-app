import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage";
const SOCKET_SERVER_URL = "http://137.116.219.96:4000";
//const SOCKET_SERVER_URL = "http://localhost:4000";

const useChat = (roomId) => {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL);

    socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
      console.log(message)
      const incomingMessage = {
        ...message,
      ownedByCurrentUser: message.roomId === roomId,
      };
      setMessages((messages) => [...messages, incomingMessage]);

    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);

  const sendMessage = (messageBody) => {
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
      body: messageBody,
      senderId: socketRef.current.id,
      roomId :roomId
    });
  };

  return { messages, sendMessage };
};

export default useChat;
