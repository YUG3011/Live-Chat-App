import User from "../Models/userModels.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from '../utils/jwtwebToken.js';

export const userRegister = async (req, res) => {
  try {
    const { fullname, username, email, password, gender } = req.body;

    if (!fullname || !username || !email || !password || !gender) {
      return res.status(400).send({ success: false, msg: 'Please fill all required fields' });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) return res.status(409).send({ success: false, msg: 'User already exists' });

    const hashpassword = await bcrypt.hash(password, 10);
    const profilepicURL = `https://api.dicebear.com/6.x/initials/svg?seed=${username}`;


    const newUser = new User({
      fullname,
      username,
      email,
      password: hashpassword,
      gender,
      profilepicture: profilepicURL
    });

    await newUser.save();
    generateTokenAndSetCookie(newUser._id, res);

    res.status(201).send({
      success: true,
      msg: 'User registered successfully',
      _id: newUser._id,
      fullname: newUser.fullname,
      username: newUser.username,
      email: newUser.email,
      profilepicture: newUser.profilepicture
    });
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).send({ success: false, msg: error.message || 'Server error' });
  }
};


export const userLogin = async (req, res) => {
    try {

        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if(!user)
            return res.status(404).send({ msg: 'User not found please register first via tab' });
        const comparePass = await bcrypt.compare(password,user.password || "");
        if(!comparePass){
            return res.status(401).send({ msg: 'Invalid email or password' });
        }
         console.log("User authenticated:", user._id);
        generateTokenAndSetCookie(user._id, res)


        res.status(200).send({
           success: true,
            msg: 'User logged in successfully',
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            email: user.email,
            gender: user.gender,
            profilepicture: user.profilepicture,
        })

    } catch (error) {
        console.error(error); // Always log the actual error
        res.status(500).send({ msg: 'Server error' });
      }
}

export const userLogout = async(req,res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });

        res.status(200).send({ msg: 'User logged out successfully' });
        
    }  catch (error) {
        console.error(error); // Always log the actual error
        res.status(500).send({ msg: 'Server error' });
      }
}  