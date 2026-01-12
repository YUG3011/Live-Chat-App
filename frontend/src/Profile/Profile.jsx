import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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

  const handleLogout = () => {
    // Clear local storage and auth context, then navigate to login
    localStorage.removeItem("chatapp");
    setauthUser(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0f172a] to-[#1e293b] px-4">
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">My Profile</h2>

        <div className="flex items-center gap-4 mb-6">
          <img
            src={authUser?.profilepicture || "https://via.placeholder.com/80"}
            alt="profile"
            className="h-20 w-20 rounded-full object-cover border border-white/20"
          />
          <div>
            <div className="text-lg font-semibold">{authUser?.fullname || authUser?.fullname}</div>
            <div className="text-sm text-gray-300">@{authUser?.username}</div>
            <div className="text-sm text-gray-300">{authUser?.email}</div>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div>
            <strong>Gender:</strong> <span className="ml-2">{authUser?.gender || "-"}</span>
          </div>
          <div>
            <strong>User ID:</strong> <span className="ml-2 break-all">{authUser?._id}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20"
          >
            Go back
          </button>
          {isOwnProfile && (
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
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
