
import { useRouter } from "next/navigation";
import { useState } from "react"

export default function Page(){
  const [roomId, setRoomId] = useState("") ;
  const router  = useRouter();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#f0f0f0',
      width: "100vh"
    }}>
      <div>
        <input value={roomId} onChange={(e) =>{
          setRoomId(e.target.value); }}
          type="text" placeholder="Enter room ID"></input>
      </div>
      <button onClick={() => router.push(`/room/${roomId}`)}></button>


    </div>
  )
}