import { User } from "../models/user.model";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const register = async (req, res) => {
    try {
        const { fullname, email, phonenumber, password, role } = req.body;
        if (!fullname || !email || !phonenumber || !password || !role) {
            return res.status(400).json({
                message: "Please fill in all fields.",
                success: false
            });
        };
        const user = await User.findOne({ email });
        if (User) {
            return res.status(400).json({
                message: "Email already exists.",
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        await User.create({
            fullname,
            email,
            phonenumber,
            password: hashedPassword,
            role,
        });

        return res.status(201).json({
            message: "User created successfully.",
            success: true
        });

    } catch (error) {
        console.error(error);

    }
}

// Login ko garna baki 
export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Please fill in all fields.",
                success: false
            });
        };
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Oppss!! Incorrect Email or Password entered.",
                success: false
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Oppss!! Incorrect Email or Password entered.",
                success: false
            });
        };

        //Checking if the role is valid or not. 
        if (role != user.role) {
            return res.status(400).json({
                message: "Oppss!! Incorrect Role entered.",
                success: false
            });
        };

        // Generating token for the user.
        const tokenData = {
            userId: user._id
        }
        const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
            expiresIn: '1d'
        });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phonenumber: user.profile,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}.`,
            success: true
        })


    } catch (error) {
        console.error(error);
    }
}


export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0, httpOnly: true, sameSite: 'strict' }).json
            ({
                message: "Logged out successfully.", success: true
            });
    } catch (error) {
        console.error(error);
    }
}

export const updateProfile = async (res, req) => {
    try {
        const { fullname, email, phonenumber, bio, skills } = req.body;
        const file = req.file;
        if (!fullname || !email || !phonenumber || !bio || !skills) {
            return res.status(400).json({
                message: "Please fill all the fields.",
                success: false
            });
        }

        //cloudinary file will be saved ..


        const skillsArray = skills.split(",");
        const userId = req.id;
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        // Updating the user data ..

        user.fullname = fullname
        user.email = email
        user.phonenumber = phonenumber
        user.bio = bio
        user.skills = skillsArray

        // resume will update later here ....

        await user.save();

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phonenumber: user.phonenumber,
            bio: user.bio,
            profile: user.profile
        }

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true
            });


    } catch (error) {
        console.log(error);
    }
}
