import { useContext, useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import lodash from "lodash";
import Logo from "./Logo";
import { UserContext } from "./UserContext";
import axios from "axios";

export default function Chat() {
  const [ws, setWs] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [textMessage, setTextMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messageBoxRef = useRef();

  const { id: userId } = useContext(UserContext);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000");
    setWs(ws);
    ws.addEventListener("message", handleMessage);
  }, []);

  const initPeople = (onlinePeople) => {
    const onlineUsers = {};
    onlinePeople.forEach(({ username, id }) =>
      id !== userId ? (onlineUsers[id] = username) : null
    );

    setOnlineUsers(onlineUsers);
  };

  const handleMessage = (e) => {
    const data = JSON.parse(e.data);
    const onlinePeople = data["online"];
    if (onlinePeople) {
      initPeople(onlinePeople);
    }
    if ("message" in data) {
      setMessages((prev) =>
        lodash.uniqBy([...prev, { ...data["message"] }], "messageId")
      );
    }
  };

  const sendMessage = (ev) => {
    ev.preventDefault();
    ws.send(
      JSON.stringify({
        message: {
          recipientId: selectedUserId,
          text: textMessage,
        },
      })
    );
    setTextMessage("");
    setMessages((prev) => [
      ...prev,
      {
        text: textMessage,
        sender: userId,
        receiver: selectedUserId,
        messageId: Math.random().toLocaleString(),
      },
    ]);
  };

  useEffect(() => {
    const div = messageBoxRef.current;
    if (div) {
      div.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (!selectedUserId) return;
    axios
      .get("/messages/" + selectedUserId)
      .then((res) => {
        const { data } = res.data;
        setMessages(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [selectedUserId]);

  return (
    <div className="flex h-screen">
      <div className="bg-white w-1/3">
        <Logo />
        {Object.keys(onlineUsers).map((id) => (
          <div
            key={id}
            onClick={(ev) => {
              ev.preventDefault();
              setSelectedUserId(id);
            }}
            className={
              "border-b border-gray-100 flex gap-2 items-center cursor-pointer " +
              (selectedUserId === id ? "bg-blue-50" : "")
            }
          >
            {selectedUserId === id && (
              <div className="w-1 h-12 bg-blue-500 rounded-r-md"></div>
            )}
            <div className="pl-2 flex gap-2 items-center py-2">
              <Avatar username={onlineUsers[id]} id={id} />
              <span>{onlineUsers[id]}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col bg-blue-50 w-2/3 p-2">
        <div className="flex-grow overflow-y-scroll">
          {!selectedUserId && (
            <div className="flex h-full items-center justify-center text-gray-400">
              &larr; Start a conversation
            </div>
          )}

          {!!selectedUserId &&
            messages
              .filter(
                ({ receiver, sender }) =>
                  (receiver === userId && sender === selectedUserId) ||
                  (receiver === selectedUserId && sender === userId)
              )
              .map((message) => (
                <div
                  key={Math.random().toLocaleString()}
                  className={
                    message["sender"] === userId ? "text-right" : "text-left"
                  }
                  ref={messageBoxRef}
                >
                  <div
                    className={
                      "p-2 text-sm my-2 inline-block " +
                      (message["sender"] === userId
                        ? "bg-blue-500 rounded-xl"
                        : "bg-white rounded-xl")
                    }
                  >
                    {message["text"]}
                  </div>
                </div>
              ))}
        </div>
        {!!selectedUserId && (
          <form className="flex gap-2" onSubmit={sendMessage}>
            <input
              type="text"
              value={textMessage}
              onChange={(ev) => setTextMessage(ev.target.value)}
              className="bg-white flex-grow border p-2 rounded-sm"
              placeholder="Type your message here"
            />
            <button
              type="submit"
              className="bg-blue-500 p-2 text-white rounded-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                />
              </svg>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
