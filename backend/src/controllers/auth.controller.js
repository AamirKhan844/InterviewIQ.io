import { genToken } from "../config/token.js";
import { User } from "../models/user.model.js";

export const googleAuth = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({
        message: "All fields are mandatory",
        success: false,
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      await User.create({
        name,
        email,
      });
    }
    let token = genToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      message: "User loggedIn successfully",
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};
