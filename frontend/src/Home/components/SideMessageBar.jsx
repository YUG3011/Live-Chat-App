import api from "../../utils/axios.js";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import userConvorsation from "../../Zustand/useConvorsation";
import { usesocketContext } from "../../context/SocketContext";

export const SideMessageBar = () => {
  const { authUser, setauthUser } = useAuth();
  const { socket, onlineUser } = usesocketContext();
  const navigate = useNavigate();
  const [searchInput, setsearchInput] = useState("");
  const [loading, setloading] = useState(false);
  const [chatUser, setchatUser] = useState([]);
  const [selectedUserId, setselectedUserId] = useState(null);
  const [searchUser, setsearchUser] = useState([]);
  const { setSelectedConversation } = userConvorsation();
  const [newMessageUsers, setnewMessageUsers] = useState("");

  const isUserOnline = (userId) => onlineUser.includes(userId);

  // Socket new message listener
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      setnewMessageUsers(newMessage);
      const allUsers = [...chatUser, ...searchUser];
      const sender = allUsers.find((u) => u._id === newMessage.senderId);

      if (sender) {
        toast.success(`${sender.username} sent you a message`);
      } else {
        toast.success("You received a new message");
      }
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, chatUser, searchUser]);

  // Fetch current chatters
  useEffect(() => {
    const chatUserHandle = async () => {
      if (!authUser) return;
      setloading(true);
      try {
        const res = await api.get("/api/user/currentchatters");
        if (res.data?.success !== false) setchatUser(res.data);
      } catch (error) {
        console.error("Error fetching current chatters:", error);
        if (error.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          localStorage.removeItem("chatapp");
          setauthUser(null);
          navigate("/login");
        }
      }
      setloading(false);
    };
    chatUserHandle();
  }, [authUser]);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setloading(true);
    try {
      const res = await api.get(`/api/user/search?search=${searchInput}`);
      if (res.data.success === false) {
        toast.info("User not found.");
      } else {
        setsearchUser(res.data);
      }
    } catch (error) {
      console.error(error);
    }
    setloading(false);
  };

  const handleLogout = async () => {
    if (!window.confirm("Are you sure you want to log out?")) return;
    try {
      const usernameConfirm = prompt("Enter username to confirm logout");
      if (usernameConfirm === authUser?.username) {
        setloading(true);
        const res = await api.post("/api/auth/logout");
        if (res.data.success !== false) {
          toast.info(res.data.message);
          localStorage.removeItem("chatapp");
          setauthUser(null);
          navigate("/login");
          toast.success("Logged out successfully");
        }
      } else {
        toast.error("Invalid username");
      }
    } catch (error) {
      console.error(error);
    }
    setloading(false);
  };

  const handleClick = (user) => {
    setSelectedConversation(user);
    setselectedUserId(user._id);
    setnewMessageUsers("");
  };

  const handlebackSearch = () => {
    setSelectedConversation(null);
    setsearchUser([]);
    setsearchInput("");
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center text-black mb-2">
        <h2 className="text-lg font-semibold m-auto">My Chats</h2>
      </div>

      <form onSubmit={handleSearchSubmit} className="flex items-center mb-4">
        <IoMdArrowRoundBack
          onClick={handlebackSearch}
          className="h-8 w-10 bg-white text-black hover:bg-black hover:text-white rounded-full cursor-pointer"
        />
        <input
          value={searchInput}
          onChange={(e) => setsearchInput(e.target.value)}
          type="text"
          placeholder="Search chats"
          className="border px-3 py-2 rounded-full w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white h-9 w-11 flex justify-center items-center rounded-full hover:bg-blue-600 transition ml-2"
        >
          <FaSearch />
        </button>
      </form>

      <div className="space-y-2">
        {(searchUser.length > 0 ? searchUser : chatUser).map((user) => (
          <div key={user._id}>
            <div
              onClick={() => handleClick(user)}
              className={`flex items-center justify-between p-3 rounded-lg shadow cursor-pointer ${
                selectedUserId === user._id
                  ? "bg-gray-500 border border-blue-500"
                  : "bg-gray-100"
              } hover:bg-blue-200 transition`}
            >
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10">
                  <CgProfile className="h-full w-full text-gray-800 rounded-full" />
                  {isUserOnline(user._id) && (
                    <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                  )}
                </div>
                <p className="font-semibold">{user.username}</p>
              </div>
              {newMessageUsers?.receiverId === authUser?._id &&
                newMessageUsers?.senderId === user._id && (
                  <div className="bg-green-500 text-black text-xs px-2 py-0.5 rounded-full">
                    +1
                  </div>
                )}
            </div>
          </div>
        ))}

        {!loading && chatUser.length === 0 && searchUser.length === 0 && (
          <div className="text-center mt-4 text-gray-500">
            No chats found. Add a friend to start chatting.
          </div>
        )}
      </div>
    </div>
  );
};
