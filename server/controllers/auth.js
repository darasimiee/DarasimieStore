import User from "../models/auth.js";
import { customError } from "../config/error.js";
import bcrypt from "bcrypt";
import generateToken from "../config/token.js";

export const registerUSer = async (req, res) => {
  const { email, username, password, profileImg } = req.body;

  try {
    //check if useer already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(customError(404, "User already exist"));
    }
    //encrypt password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    //create a new user
    const newUser = await User.create({
      username,
      email,
      password: passwordHash,
      profileImg:
        profileImg ||
        "https://res.cloudinary.com/ceenobi/image/upload/v1687743800/icon-256x256_d7vo98.png",
    });

    const user = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      profileImg: newUser.profileImg,
    };
    const access_token = generateToken(user._id);
    res
      .status(201)
      .json({ access_token, user, msg: "User registration successful" });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const loginUser = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (!existingUser) return next(customError(400, "User does not exist"));
    const isPasswordMatch = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordMatch) return next(customError(400, "Invalid Password"));

    const user = {
      _id: existingUser._id,
      username: existingUser.username,
      email: existingUser.email,
      profileImg: existingUser.profileImg,
      isAdmin: existingUser.isAdmin,
    };
    const access_token = generateToken(existingUser._id);
    res.status(200).json({ access_token, user, msg: "Login successful" });
  } catch (error) {
    res.status(500).json(error);
  }
};

//searching for something, you use the useparams
export const getSingleUser = async (req, res, next) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username });
    if (!user) return next(customError(400, "Cannot find User."));
    const { password, ...others } = user._doc;

    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const updateUser = async (req, res, next) => {
  const { username, email, password, profileImg } = req.body;
  const userId = await User.findById(req.user.id);
  try {
    if (userId) {
      userId.username = username || userId.username;
      userId.email = email || userId.email;
      userId.profileImg = profileImg || userId.profileImg;
      if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        if (hashedPassword) {
          userId.password = hashedPassword;
        }
      } else {
        userId.password = userId.password;
      }
      const updateUser = await userId.save();
      const user = {
        _id: updateUser._id,
        username: updateUser.username,
        email: updateUser.email,
        profileImg: updateUser.profileImg,
        isAdmin: updateUser.isAdmin,
        createdAt: updateUser.createdAt,
      };

      const access_token = generateToken(updateUser._id);
      res.status(201).json({ access_token, user, msg: "User profile updated" });
    } else {
      res.status(404);
      throw new error("User profile not updated");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};
