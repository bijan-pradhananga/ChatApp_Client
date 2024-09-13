import { useEffect, useState, useRef } from "react";

export default function Chat({ socket, id,username, room }) {
  const [currentMsg, setCurrentMsg] = useState('');
  const [msgList, setMsgList] = useState([]);
  const scrollableDivRef = useRef(null);

  const sendMsg = async () => {
    if (username && room) {
      if (currentMsg !== '') {
        const msgData = {
          id,
          room,
          username,
          msg: currentMsg,
          time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
        };
        await socket.emit("send_msg", msgData);
        setMsgList((prevMsgList) => [...prevMsgList, msgData]);
        setCurrentMsg('');
      }
    } else {
      alert('Join a room first');
    }
  };

  useEffect(() => {
    // Listen for new messages
    socket.on('receive_msg', (data) => {
      setMsgList((prevMsgList) => [...prevMsgList, data]);
    });

    // Cleanup the socket event listener when component unmounts
    return () => {
      socket.off('receive_msg');
    };
  }, [socket]);

  // Auto-scroll to bottom when msgList changes
  useEffect(() => {
    if (scrollableDivRef.current) {
      scrollableDivRef.current.scrollTop = scrollableDivRef.current.scrollHeight;
    }
  }, [msgList]); // This triggers every time a new message is added

  return (
    <>
      <ChatHeader />
      <ChatBody msgList={msgList} id={id} username={username} scrollableDivRef={scrollableDivRef} />
      <ChatFooter sendMsg={sendMsg} currentMsg={currentMsg} setCurrentMsg={setCurrentMsg} />
    </>
  );
}

const ChatHeader = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
        Chat Room
      </h1>
    </div>
  );
};

const ChatBody = ({ msgList, id, scrollableDivRef }) => {
  return (
    <div ref={scrollableDivRef} className="my-4 max-h-80 overflow-auto">
      {msgList.map((data, index) => (
        <div
          key={index} // You can also use `data.id` if your data has unique IDs
          className={`flex my-2 mr-1 text-white ${id === data.id ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`p-2 max-w-xs break-words rounded ${id === data.id ? 'bg-blue-700' : 'bg-gray-500'}`}
          >
            {data.msg}
          </div>
        </div>
      ))}
    </div>
  );
};

const ChatFooter = ({ sendMsg, currentMsg, setCurrentMsg }) => {
  return (
    <div className="flex justify-between">
      <input
        type="text"
        placeholder="Enter a message"
        value={currentMsg}
        className="bg-gray-50 border border-gray-300 outline-none text-gray-900 text-sm rounded-tl-lg rounded-bl-lg focus:ring-blue-700 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        onChange={(event) => setCurrentMsg(event.target.value)}
      />
      <button
        className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-tr-lg rounded-br-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        onClick={sendMsg}
      >
        Send
      </button>
    </div>
  );
};
