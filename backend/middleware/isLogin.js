import jwt from "jsonwebtoken";
import User from "../Models/userModels.js";

const isLogin = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ msg: "Unauthorized. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); //  secret required
    console.log(` USER ID:" ${decoded.userId} "success"` );
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found. success" });
    }

    req.user = user;
    next();

  } catch (err) {
    console.error("isLogin error:", err);
    res.status(401).json({ msg: "Invalid or expired token" });
  }
};

export default isLogin;
