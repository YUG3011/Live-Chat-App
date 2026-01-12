import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/axios.js";
import { toast } from "react-toastify";

export const Profile = () => {
  const { authUser, setauthUser } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  // If no authUser, redirect to login
  if (!authUser) {
    navigate("/login");
    return null;
  }

  // Only allow viewing your own profile for now (id matches authUser._id)
  const isOwnProfile = String(authUser._id || authUser._id) === String(id) || !id;

  const handleLogout = async () => {
    try {
      const confirmLogout = confirm("Are you sure you want to logout?");
      if (!confirmLogout) return;

      const ans = prompt("Enter your username to confirm logout");
      if (ans !== authUser?.username) {
        toast.error("Invalid username");
        return;
      }

      const res = await api.post("/api/auth/logout");
      if (res.data?.success !== false) {
        localStorage.removeItem("chatapp");
        setauthUser(null);
        toast.success(res.data?.msg || "Logout successful");
        navigate("/login");
      } else {
        toast.error(res.data?.msg || "Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Network error while logging out");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0f172a] to-[#1e293b] px-4 py-8">
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-xl p-6 sm:p-8 text-white">
        <h2 className="text-2xl font-bold mb-4 text-center sm:text-left">My Profile</h2>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6">
          <img
            src={authUser?.profilepicture || "https://via.placeholder.com/80"}
            alt="profile"
            className="h-24 w-24 rounded-full object-cover border border-white/20"
          />
          <div className="text-center sm:text-left">
            <div className="text-lg font-semibold">{authUser?.fullname || authUser?.fullname}</div>
            <div className="text-sm text-gray-300 break-all">@{authUser?.username}</div>
            <div className="text-sm text-gray-300 break-all">{authUser?.email}</div>
          </div>
        </div>

        <div className="space-y-3 mb-6 text-sm sm:text-base">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <strong>Gender:</strong> <span className="sm:ml-2">{authUser?.gender || "-"}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center">
            <strong>User ID:</strong> <span className="sm:ml-2 break-all">{authUser?._id}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 text-center"
          >
            Go back
          </button>
          {isOwnProfile && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 text-center"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
