import useChat from "../../services/useChat";
import React, { useState } from 'react';
import "./ChatRoom.css"
import axios from 'axios';

import useSalaChat from '../hooks/useSalaChat';
import useContador from '../hooks/useContador';


const ChatRoom = () => {
  const {salaChat,setSalaChat} = useSalaChat();
  const {Contador,setContador} = useContador(0);
  const [roomName, setRoomName] = React.useState();

  const handleRoomNameChange = (event) => {
    setRoomName(event.target.value);
    
  };
  const { messages, sendMessage } = useChat(salaChat);
  const [newMessage, setNewMessage] = React.useState("");
  const [show, setShow] = useState(true);
  const handleNewMessageChange = (event) => {
  
    setNewMessage(event.target.value);
  };


  const handleSendMessage = () => {
    sendMessage(newMessage);
    //HACE BIEN
    //console.log(newMessage +" Enviar Mensaje");
    setNewMessage("");
    
  };


    const [responseData, setResponseData] = React.useState();
    const fetchData = React.useCallback(() => {
        axios({
            "method": "GET",
            "url": "http://137.116.219.96/rutas/buscarRutas/all",
            //"url": "http://localhost:8080/rutas/buscarRutas/all",
        })
            .then((response) => {
                setResponseData(response.data)
                setSalaChat(response.data[0].nombre)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])
    React.useEffect(() => {
        fetchData()
    }, [fetchData])

  const cambiarDatos = () =>{
     
     
    if(Contador >= responseData.length){
      setSalaChat(responseData[0].nombre)
      setContador(Contador - responseData.length);      
    }
    else{
    setContador(Contador +1)
    setSalaChat(responseData[Contador].nombre)
    }

    
  }
 
  return (
    <div>
        <button
        type="button" className="button-chat"
        onClick={() => {
          setShow(!show);
        }}
      >
        {show ? 'Mostrar Chat' : 'Ocultar Chat'}
      </button>
      {show ? (
          <div className="chat-room-container">
          <h1 className="room-name">Room: {salaChat}</h1>
          <div className="messages-container">
            <ol className="messages-list">
              {messages.map((message, i) => (

                message.roomId == salaChat ? 
                  <li
                  key={i}
                  className={`message-item ${
                    message.ownedByCurrentUser ? "my-message" : "received-message"
                  }`}
                >
                  {message.body}
                </li>
                : <li  key={i}></li>
              
                
            
                 
                

              ))}
              {/*
              console.log(messages)*/
              }
               
            </ol>
          </div>
           <textarea
             value={newMessage}
             onChange={handleNewMessageChange}
             placeholder="Write message..."
             className="new-message-input-field"
           />
           <button onClick={handleSendMessage} className="send-message-button">
             Send
           </button>
           <button onClick={()=>{ cambiarDatos()}} onChange={handleRoomNameChange}   className="send-message-button">
             Cambiar Sala
           </button>

          
         </div>
      ) : (
        <div style={{ color: 'blue' }}></div>
      )}

 

    </div>
   
  );
};

export default ChatRoom;
