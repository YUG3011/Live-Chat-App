import React from "react";
import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Register = () => {
  const { setauthUser } = useAuth();
  const navigate = useNavigate();
  const [userInput, setuserInput] = useState({});
  const [loading, setLoading] = useState(false);
  const [inputData, setinputData] = useState({});

  const selectGender = (e) => {
    const updatedGender = e === inputData.gender ? "" : e;
    setinputData((prev) => ({ ...prev, gender: updatedGender }));
    setuserInput((prev) => ({ ...prev, gender: updatedGender }));
  };

  // ✅ Updates both inputData and userInput when typing in fields
  const handleInput = (e) => {
    const { id, value } = e.target;
    setinputData((prev) => ({ ...prev, [id]: value }));
    setuserInput((prev) => ({ ...prev, [id]: value }));
  };
  console.log(userInput);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    //  Confirm password check using inputData (as requested)
    if (inputData.password !== inputData.confirmpassword) {
      setLoading(false);
      return toast.error("Passwords do not match");
    }

    try {
      const register = await axios.post(
        "http://localhost:3000/api/auth/register",
        userInput,
        { withCredentials: true }
      );

      const data = register.data;
      if (!data.success) {
        setLoading(false);
        return toast.error(data.msg || "Registration failed");
      }

      toast.success(data.msg || "registered success");
      localStorage.setItem("chatapp", JSON.stringify(data));
      setauthUser(data);
      navigate("/login");
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error(error.response?.data?.msg || "Failed to register");
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#2e2e2e] via-[#121212] to-[#1a1a1a] px-4 ">
    <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl shadow-2xl px-6 py-6">

      <h2 className="text-3xl font-bold text-white text-center mb-6">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          required
          id="fullname"
          type="text"
          onChange={handleInput}
          placeholder="Full Name"
          className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#81ffa9] transition"
        />
        <input
          required
          id="username"
          type="text"
          onChange={handleInput}
          placeholder="Username"
          className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#81ffa9] transition"
        />
        <input
          required
          id="email"
          type="email"
          onChange={handleInput}
          placeholder="Email"
          className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#81ffa9] transition"
        />
        <input
          required
          id="password"
          type="password"
          onChange={handleInput}
          placeholder="Password"
          className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#81ffa9] transition"
        />
        <input
          required
          id="confirmpassword"
          type="password"
          onChange={handleInput}
          placeholder="Confirm Password"
          className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#81ffa9] transition"
        />

        {/* Gender selection toggle-style */}
        <div className="flex items-center justify-center gap-4 mt-3">
          <button
            type="button"
            onClick={() => selectGender("male")}
            className={`px-5 py-2 rounded-full border ${
              inputData.gender === "male"
                ? "bg-[#81ffa9] text-black border-transparent"
                : "bg-white/10 text-white border-white/30"
            } transition`}
          >
            Male
          </button>
          <button
            type="button"
            onClick={() => selectGender("female")}
            className={`px-5 py-2 rounded-full border ${
              inputData.gender === "female"
                ? "bg-[#81ffa9] text-black border-transparent"
                : "bg-white/10 text-white border-white/30"
            } transition`}
          >
            Female
          </button>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-[#81ffa9] text-black font-semibold rounded-xl hover:bg-white hover:text-black transition"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <div className="text-center mt-6 text-white text-sm">
        <p>Already have an account?</p>
        <Link to={"/login"} className="text-[#81ffa9] hover:underline">
          Login here
        </Link>
      </div>
    </div>
  </div>
);

};
