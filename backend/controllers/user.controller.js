import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import getDataUri from "../utils/datauri.js";
import { User } from '../models/user.model.js';
import cloudinary from '../utils/cloudinary.js';
import { Post } from '../models/post.model.js';

export const register = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        if (!username || !password || !email) {
            return res.status(401).json({
                message: "Please fill all fields",
                success: false
            });
        }
        const user = await User.findOne({ email })
        if (user) {
            return res.status(401).json({
                message: "Try another email",
                success: false
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        await User.create({
            username,
            email,
            password: hashedPassword
        })
        return res.status(201).json({
            message: "Account created succesfully",
            success: true
        })

    } catch (error) {
        console.log(error)
    }

}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "Please fill all the fields",
                success: false,
            })
        }
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({
                message: "User not found",
                success: false
            })
        }
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
            return res.status(401).json({
                message: "Incorrect Password",
                succes: false
            })
        }

        const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" })
        const populatedPosts = await Promise.all(
            user.posts.map(async (postId) => {
                const post = await Post.findById(postId);
                if (post.author.equals(user._id)) {
                    return post;
                }
                return null;
            })
        )
        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            gender: user.gender,
            followers: user.followers,
            following: user.following,
            posts: populatedPosts
        }
        return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
            message: `Welcome ${user.username}`,
            success: true,
            user
        });

        // return res.cookie('token', token, { httpOnly: true, sameSite: 'strict', maxAge: 1 * 24 * 60 * 60 * 1000 }).json({
        //     message: "Login Successful",
        //     success: true,
        //     user
        // });
    } catch (error) {
        console.log(error)
    }
}

export const logout = async (req, res) => {
    try {
        return res.cookie("token", "", { maxAge: 0 }).json({
            message: 'Logged out successfully.',
            success: true
        });
    } catch (error) {
        console.log(error);
    }
}

export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findById(userId).populate({ path: 'posts', createdAt: -1 }).populate('bookmarks');
        return res.status(200).json({
            user,
            success: true
        })

    } catch (error) {
        console.log(error);
    }
}

export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender } = req.body;
        const profilePhoto = req.file;
        let cloudinaryResponse;
        if (profilePhoto) {
            const fileUri = getDataUri(profilePhoto);
            cloudinaryResponse = await cloudinary.uploader.upload(fileUri);
        }
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            })
        }
        console.log("bio: ", bio)
        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePhoto) user.profilePicture = cloudinaryResponse.secure_url;
        await user.save();
        return res.status(200).json({
            message: "Profile updated successfully",
            success: true,
            user
        })

    } catch (error) {
        console.log(error)
    }
}

export const getSuggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password")
        if (!suggestedUsers) {
            return res.status(400).json({
                message: "Currently do not have any users"
            })
        }
        return res.status(200).json({
            success: true,
            users: suggestedUsers
        });

    } catch (error) {
        console.log(error);
    }
}

export const followOrUnfollow = async (req, res) => {
    try {
        const follower = req.id;
        const followingUser = req.params.id;
        console.log("follower", follower);
        console.log("followingUser : ", followingUser)
        if (follower === followingUser) {
            return res.status(400).json({
                message: "You cannot follow/unfollow yourself",
                success: false
            });
        }
        const user = await User.findById(follower);
        const targetUser = await User.findById(followingUser)
        if (!user || !targetUser) {
            return res.status(400).json({
                message: "User not found",
                success: false
            })
        }
        const isFollowing = user.following.includes(followingUser)
        if (isFollowing) {
            await Promise.all([
                User.updateOne({ _id: follower }, { $pull: { following: followingUser } }),
                User.updateOne({ _id: followingUser }, { $pull: { followers: follower } })

            ]);

            const updatedUser = await User.findById(followingUser);
            const updatedFollowerUser = await User.findById(follower);

            res.status(200).json({
                message: "Unfollowed",
                success: true,
                user: updatedUser,
                followerUser: updatedFollowerUser
            })
        }
        else {
            await Promise.all([
                User.updateOne({ _id: follower }, { $push: { following: followingUser } }),
                User.updateOne({ _id: followingUser }, { $push: { followers: follower } })

            ]);

            const updatedUser = await User.findById(followingUser);
            const updatedFollowerUser = await User.findById(follower);

            res.status(200).json({
                message: "Followed Successfully",
                success: true,
                user: updatedUser,
                followerUser: updatedFollowerUser
            })
        }
    } catch (error) {
        console.log(error)
    }
}
