import { User } from "../models/user_model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../models/post_model.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User already exists with this email",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      username,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({
      message: "User created successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const token = await jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "7d",
    });

    const populatedPosts = await Promise.all(
      user.posts.map(async (postId) => {
        const post = await Post.findOne({ _id: postId });
        if (post.author.equals(user._id)) {
          return post;
        }
        return null;
      })
    );
    // user.posts contains IDs of the user's posts
    // Using .map() to go through each post ID
    // Fetch the full post document by ID
    // Double-check if the post's author is the same user
    // If valid, include the post; otherwise return null
    // Promise.all ensures all async operations complete before moving on

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePicture: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: populatedPosts,
    };
    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpsOnly: true,
        sameSite: "strict",
      })
      .json({
        message: `Welcome back ${user.username}`,
        user,
        success: true,
      });
  } catch (error) {
    return res.status(500).json({
      message: "Login failed",
      success: false,
    });
  }
};

export const logout = async (_, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logout successful",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Logout failed",
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    let user = await User.findById(userId)
      .populate({ path: "posts", createdAt: -1 })
      .populate("bookmarks");
    return res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error);
  }
};

export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender } = req.body;
    const profilePicture = req.file; //Take the entire uploaded file object from req.file and store it in a variable called profilePicture.(multer will do this)
    let cloudResponse;

    if (profilePicture) {
      const fileUri = getDataUri(profilePicture); //Convert the image to base64 format using the getDataUri function.
      cloudResponse = await cloudinary.uploader.upload(fileUri);
    }

    const user = await User.findById(userId).select("-password"); //Find the user but exclude the password field from the result
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    if (profilePicture) user.profilePicture = cloudResponse.secure_url;

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully.",
      success: true,
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Profile update failed.",
      success: false,
    });
  }
};
export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select(
      "-password"
    );

    //$ne = "not equal".This means: “Find all users whose _id is NOT equal to the current user’s ID.” So it excludes the currently logged-in user from the list. .select("-password"): Do not include the password field in the results for security.

    if (!suggestedUsers) {
      return res.status(400).json({
        message: "Currently do not have any users",
      });
    }
    return res.status(200).json({
      success: true,
      users: suggestedUsers,
    });
  } catch (error) {
    console.log(error);
  }
};
export const followOrUnfollow = async (req, res) => {
  try {
    const currentUserId = req.id; // The one who is trying to follow/unfollow
    const targetUserId = req.params.id; // The user to be followed/unfollowed

    // Prevent users from following or unfollowing themselves
    if (currentUserId === targetUserId) {
      return res.status(400).json({
        message: "You cannot follow/unfollow yourself",
        success: false,
      });
    }

    const user = await User.findById(currentUserId);
    const targetUser = await User.findById(targetUserId);

    // If either user doesn't exist
    if (!user || !targetUser) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    // Check if the current user is already following the target user
    const isFollowing = user.following.includes(targetUserId);

    if (isFollowing) {
      // Unfollow logic
      await Promise.all([
        User.updateOne({ _id: currentUserId },{ $pull: { following: targetUserId }}),
        User.updateOne({ _id: targetUserId }, { $pull: { followers: currentUserId }}),
      ]);
      return res.status(200).json({
        message: "Unfollowed successfully",
        success: true,
      });

    } else {
      // Follow logic
      await Promise.all([
        User.updateOne({ _id: currentUserId }, { $push: { following: targetUserId }}),
        User.updateOne({ _id: targetUserId }, { $push: { followers: currentUserId }}),
      ]);
      return res.status(200).json({
        message: "Followed successfully",
        success: true,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
