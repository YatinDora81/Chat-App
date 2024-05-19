import UserModel from "../models/user.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { fullName, userName, password, confirmPassword, gender } = req.body;

    const user = await UserModel.findOne({ userName });
    if (user) {
      return res
        .status(400)
        .json({ error: "User Already Exist!!! Try with different UserName." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Password dont match" });
    }

    //HashPASS
    const hassPass = await bcrypt.hash(password, 10);

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${userName}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${userName}`;

    const newUser = await UserModel({
      fullName,
      userName,
      password: hassPass,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });

    if (newUser) {
      //generate jwt token
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(200).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        userName: newUser.userName,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ error: "Invalid User Data" });
    }
  } catch (error) {
    console.log(`error at signup controller ${error}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await UserModel.findOne({ userName });
    const isPassCorrect = await bcrypt.compare(password, user?.password || "");

    if (!user || !isPassCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      userName: user.userName,
      profilePic: user.profilePic,
    });

  } catch (error) {
    console.log(`error at login controller ${error}`);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const logout = async (req, res) => {
  try {
    
    res.cookie("jwt","",{maxAge:0});
    res.status(200).json({message : "Logged Out Successfully"})

  } catch (error) {
    console.log(`error at logout controller ${error}`);
    res.status(500).json({ error: "Internal server error" });
  }
};
