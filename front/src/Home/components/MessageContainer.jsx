import React, { useRef, useEffect, useState } from "react";
import { VscAccount } from "react-icons/vsc";
import { BiSend } from "react-icons/bi";
import { LuMessageCircle } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import userConvorsation from "../../Zustand/useConvorsation";
import { useAuth } from "../../context/AuthContext";
import notify from "../../assets/sound/new-message-2-125765.mp3";
import { usesocketContext } from "../../context/SocketContext";
import { CiMenuKebab } from "react-icons/ci";

export const MessageContainer = () => {
  let lastShownDate = null;
  const {
    messages = [],
    selectedConversation,
    setMessage,
  } = userConvorsation();
  const { authUser } = useAuth();
  const navigate = useNavigate();
  const { Socket } = usesocketContext();

  const [loading, setLoading] = useState(false);
  const [sendData, setSendData] = useState("");
  const lastMessageRef = useRef(null);

  useEffect(() => {
    if (!Socket) return;

    const handleNewMessage = (newMessage) => {
      if (newMessage.senderId !== authUser._id) {
        const sound = new Audio(notify);
        sound.play().catch((err) => console.warn("Audio play blocked:", err));
      }

      setMessage((prev) => [...prev, newMessage]);
    };

    Socket.on("newMessage", handleNewMessage);

    return () => {
      Socket.off("newMessage", handleNewMessage);
    };
  }, [Socket, authUser._id, setMessage]);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const fetchMessages = async () => {
    if (!selectedConversation?._id) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/message/${selectedConversation._id}`, {
        withCredentials: true,
      });
      if (res.data?.success) {
        setMessage(res.data.messages);
      }
    } catch (error) {
      console.log("Fetch error:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedConversation?._id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sendData.trim()) return;

    try {
      const response = await axios.post(
        `http://localhost:3000/api/message/send/${selectedConversation._id}`,
        {
          message: sendData,
          receiverId: selectedConversation._id,
        },
        {
          withCredentials: true,
        }
      );

      const newMessage = response.data.data;

      setMessage((prevMessages) => [...prevMessages, newMessage]);
      setSendData("");
    } catch (err) {
      console.error("Send message error:", err);
    }
  };

  return (
    <>
      {!selectedConversation ? (
        <div className="flex justify-center items-center h-full bg-white rounded-lg">
          <div className="text-gray-500 text-lg font-medium">
            Search Your Friends And Start Chat
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full rounded-lg bg-gray-100 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-2.5 bg-white border-b">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(`/profile/${authUser?._id}`)}
                className="bg-gray-200 p-2 rounded-full hover:scale-105 transition"
              >
                <VscAccount className="h-6 w-6 text-gray-800" />
              </button>
              <h2 className="font-semibold text-lg text-gray-800">
                {selectedConversation?.username}
              </h2>
            </div>
            <button className="text-black hover:text-gray-800">
              <CiMenuKebab size={25} />
            </button>
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading && (
              <div className="flex items-center justify-center h-full">
                <div className="loading loading-spinner text-blue-500" />
              </div>
            )}

            {!loading && messages.length === 0 && (
              <div className="flex justify-center items-center text-gray-500">
                SEND MESSAGE TO START CONVERSATION
                <LuMessageCircle size={40} className="ml-2 text-blue-400" />
              </div>
            )}

            {!loading &&
              messages.map((message, index) => {
                const isSender = message.senderId === authUser._id;
                const messageDate = new Date(message.createdAt).toDateString();
                const showDate = messageDate !== lastShownDate;
                lastShownDate = messageDate;

                return (
                  <div key={message._id}>
                    {showDate && (
                      <div className="text-center text-gray-500 text-sm my-2">
                        {messageDate}
                      </div>
                    )}

                    <div
                      ref={
                        index === messages.length - 1 ? lastMessageRef : null
                      }
                      className={`flex items-end ${
                        isSender ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`rounded-2xl px-4 py-2 text-sm max-w-xs shadow ${
                          isSender
                            ? "bg-green-200 text-green-900 ml-auto"
                            : "bg-gray-700 text-white mr-auto border"
                        }`}
                      >
                        {message.message}
                        <div
                          className={`text-[10px] text-right mt-1 opacity-60 ${
                            isSender ? "text-green-700"
                            : "text-gray-400"
                          }`}
                        >
                          {new Date(message.createdAt).toLocaleTimeString(
                            "en-IN",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSubmit} className="p-3 bg-white border-t">
            <div className="flex items-center gap-2">
              <input
                value={sendData}
                onChange={(e) => setSendData(e.target.value)}
                type="text"
                placeholder="Enter a message..."
                className="flex-1 border rounded-full px-4 py-2 text-sm"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
              >
                <BiSend className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
