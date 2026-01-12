import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import api from "../utils/axios.js";

export const Log = () => {
  const { setauthUser } = useAuth();
  const navigate = useNavigate();
  const [userInput, setuserInput] = useState({});
  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    setuserInput({
      ...userInput,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const login = await api.post(
        "/api/auth/login",
        userInput,
      );

      const data = login.data;
      if (data.success === false) {
        setLoading(false);
        return;
      }

      toast.success(data.message || "Login successful");
      localStorage.setItem("chatapp", JSON.stringify(data));
      setauthUser(data);
      setLoading(false);
      navigate("/");
    } catch (error) {
      setLoading(false);
      toast.error(
        error?.response?.data?.message ||
          "Please enter valid email or password"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#1f1c2c] to-[#928dab] px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/30 rounded-3xl shadow-xl p-8">
        <h2 className="text-3xl font-semibold text-white text-center mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            required
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            onChange={handleInput}
            placeholder="Email"
            className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#81ffa9] transition"
          />
          <input
            required
            id="password"
            type="password"
            name="password"
            autoComplete="current-password"
            onChange={handleInput}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-[#81ffa9] transition"
          />
          <div className="flex items-center text-white text-sm">
            <input type="checkbox" id="age" className="mr-2" />
            <label htmlFor="age">I am 18 years old</label>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-[#81ffa9] text-black rounded-xl hover:bg-white hover:text-black transition font-semibold"
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-6 text-white text-sm">
          <p>Don't have an account?</p>
          <Link to={"/register"} className="text-[#81ffa9] hover:underline">
            Register here
          </Link>
          <div>
            
          </div>
        </div>
      </div>
    </div>
  );
};
