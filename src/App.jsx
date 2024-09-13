import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import Chat from "./Chat";
const socket = io.connect("http://localhost:3001")

function App() {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [chat, setChat] = useState(false)
  const joinRoom = () => {
    if (name !== '' & room !== '') {
      socket.emit("join_room", room)
      setChat(true)
    } else {
      alert('Enter both name and room')
    }
  }

  useEffect(()=>{
    socket.on('connect', () => {
      setId(socket.id); 
    });

    // Cleanup event listener when component unmounts
    return () => {
      socket.off('connect');
    };
  },[socket])
  return (
    <>
      <div className="w-full h-screen flex justify-center items-center">
        <main className="bg-white w-96 rounded-lg shadow dark:border md:mt-0 sm:max-w-md p-6 dark:bg-gray-800 dark:border-gray-700">
          {!chat && <JoinMenu name={name} setName={setName} room={room} setRoom={setRoom} joinRoom={joinRoom} />}
          {chat && <Chat id={id} socket={socket} username={name} room={room} />}
        </main>
      </div>

    </>
  )
}

const JoinMenu = ({ name, setName, room, setRoom, joinRoom }) => {
  return (
    <>
      <div>
        <h1 class="text-xl font-bold leading-tight tracking-tight mb-6 text-gray-900 md:text-2xl dark:text-white">
          Join Chat
        </h1>
        <input type="text" placeholder="UserName"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={name} onChange={(e) => { setName(e.target.value) }}
          required /> <br />
        <input type="text" placeholder="Room ID"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={room} onChange={(e) => { setRoom(e.target.value) }}
          required /> <br />
        <button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={joinRoom}
        >
          Join Room
        </button>
      </div>
    </>
  )
}

export default App


