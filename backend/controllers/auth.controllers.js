import User from "../models/user.models.js";
import generateTokenAndSetCookie from "../utils/generateToken.js"
import bcrypt from 'bcryptjs'

export const signup = async (req, res) => {
   try {
    const {fullname, username, password, confirmPassword, gender} = req.body

    console.log(req.body)

    if(password != confirmPassword){
        return res.status(400).json({error: "Passwords don't match"})
    }

    const salt = await bcrypt.genSalt(10)
    
    const user = await User.findOne({username})
    const hasedPass = await bcrypt.hash(password, salt )

    if(user){
        return res.status(400).json({error:"User Exists!!"})
    }

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`

    const newUser = new User({
        fullname,
        username,
        password: hasedPass,
        gender,
        profilePic: gender === 'male' ? boyProfilePic : girlProfilePic

    })
    
    if(newUser){
        console.log(newUser._id);
        generateTokenAndSetCookie(newUser._id, res)
        await newUser.save()
        res.status(201).json({
            _id:newUser._id,
            fullname: newUser.fullname,
            username: newUser.username,
            profilePic: newUser.profilePic
        })
    } else {
        res.status(400).json({error: "Invalid data"})
    }

   } catch (error) {
    console.log("Error while signup:- ",error.message);
    res.status(500).json({error: "Internal Server Error"})
    
   }
}

export const login = async (req, res) => {
    try {
        const {username, password} = req.body
        console.log(username);
        console.log(password);
        const user = await User.findOne({username})
        const isPassCorrect = await bcrypt.compare(password, user?.password || "")
        if(!user || !isPassCorrect){
            return res.status(400).json({error: "Invalid data"})
        }

        generateTokenAndSetCookie(user._id, res)

        res.status(200).json({
            _id:user._id,
            fullname: user.fullname,
            username: user.username,
            profilePic: user.profilePic
        })

    } catch (error) {
        console.log("Error while login:- ",error.message);
        res.status(500).json({error: "Internal Server Error"})
    }
}


export const logout = (req, res) => {
    try {
        res.cookie('jwt', "", {
            maxAge: 0
        })
        res.status(200).json({
            message: 'Logged out successfully'
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            error: "Internal Server Error"
        })
    }
}