import { useEffect, useState } from "react"
import { useSocket } from "../hooks/useSocket";

export function ChatRoomClient({
    messages,
    id
}:{
    messages: {messages: string}[],
    id: string
}){

    const [chats, setChats] = useState(messages)
    const [currentMessage, setCurrentMessage] = useState("");
    const { socket, loading} = useSocket();
    useEffect(()=>{
        if(socket && !loading){

            socket.send(JSON.stringify({
                type: "join_room",
                roomId: id
            }));
            socket.onmessage = (event) =>{
                const parsedData = JSON.parse(event.data);
                if( parsedData.type === "chat"){
                    setChats( c => [...c, {messages:parsedData.message}])
                }
            }
        }
    },[])

    return <div>
        {chats.map(m => <div>{m.messages}</div>)}

        <input value={currentMessage} onChange={(e) =>{setCurrentMessage(e.target.value)}}></input>
        <button onClick={()=>{
            socket?.send(JSON.stringify({
                type : "chat",
                roomId: id,
                message: currentMessage
            }))
        }}> Send Message</button>
    </div>
}