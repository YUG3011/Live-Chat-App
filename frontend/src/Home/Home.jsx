import React from "react";
import { useAuth } from "../context/AuthContext";
import { SideMessageBar } from "./components/SideMessageBar";
import { MessageContainer } from "./components/MessageContainer";
import { VscAccount } from "react-icons/vsc";
import { RiLogoutCircleLine } from "react-icons/ri";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();
  const { authUser } = useAuth();
  const handleLogout = async () => {
    const a = confirm("Are you sure you want to logout?");
    if (a === false) return;
    let ans = prompt("enter your password")
    if(ans === authUser.username){
    const res = await axios.post("http://localhost:3000/api/auth/logout");
    if (res.data.success) {
      setauthUser(null);
      toast.success("Logout successful");
    }
    localStorage.removeItem("authToken");
    navigate("/login");
  }
  else{
    confirm("Invalid username");
  }
  };
  return (
    <>
      <div className="flex flex-col h-screen w-full bg-gradient-to-br  bg-black">
        {/* Top Nav */}
        <div className="flex items-center justify-between px-4 py-2 bg-white shadow-md">
          <div className="flex items-center gap-2"></div>
          <h1 className="text-lg font-semibold text-center">Live-Chat-App</h1>
          <div className="flex items-center gap-6">
            {/* Profile */}
            <div className="flex flex-col items-center">
              <VscAccount
                onClick={() => navigate(`/profile/${authUser?._id}`)}
                className="h-8 w-8 hover:scale-110 hover:bg-green-900 rounded-full cursor-pointer"
              />
              <span className="text-xs mt-1">Profile</span>
            </div>

            {/* Logout */}
            <div className="flex flex-col items-center">
              <RiLogoutCircleLine
                onClick={handleLogout}
                className="h-8 w-8 hover:scale-110 hover:bg-red-700 rounded-full cursor-pointer"
              />
              <span className="text-xs mt-1">Logout</span>
            </div>
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex flex-row flex-1 overflow-hidden p-4 gap-4">
          <div className="bg-white rounded-lg shadow-md p-3 w-1/3 overflow-y-auto">
            <SideMessageBar />
          </div>
          <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
            <MessageContainer />
          </div>
        </div>
      </div>
    </>
  );
};
