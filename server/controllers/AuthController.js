 import { compare } from "bcrypt";
import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import { renameSync,unlinkSync} from "fs";

const maxAge = 3 * 24 * 60 * 60 * 1000; // Token expiry in milliseconds

// Ensure JWT_KEY is defined
const createToken = (email, userId) => {
    if (!process.env.JWT_KEY) {
      throw new Error("JWT_KEY is not defined in environment variables");
    }
  
    return jwt.sign({ email, userId }, process.env.JWT_KEY, { expiresIn: maxAge });
  };
  

export const signup = async (request, response, next) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).send("Email and password are required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response.status(400).json({ message: "Email already exists" });
    }

    const user = await User.create({ email, password });

    const token = createToken(email, user.id);

    response.cookie("jwt", token, {
      maxAge,
      secure: process.env.NODE_ENV === "production",
      sameSite: "None",
    });

    return response.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.log(error);
    return response.status(500).send("Internal Server Error");
  }
};


export const login = async (request, response, next) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).send("Email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return response.status(404).json({ message: "User Not Found" });
    }

    const auth = await compare(password, user.password);
    if (!auth) {
      return response.status(401).json({ message: "Password is Incorrect" });
    }

    const token = createToken(email, user.id);

    console.log("Generated Token:", token); // Debugging

    const maxAge = 24 * 60 * 60 * 1000; // 1 day in milliseconds
    response.cookie("jwt", token, {
      httpOnly: true,
      maxAge,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    });

    return response.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
    });
  } catch (error) {
    console.error(error);
    return response.status(500).send("Internal Server Error");
  }
};



export const getUserInfo = async (request, response, next) => {
  try {
  const userData = await User.findById(request.userId);
  if(!userData) {
    return response.status(404).json({ message: "User Not Found" });
  }


    return response.status(200).json({
        id: userData.id,
        email: userData.email,
        profileSetup: userData.profileSetup,
        firstName:userData.firstName,
        lastName: userData.lastName,
        image: userData.image,
        color: userData.color,
      
    });
  } catch (error) {
    console.log(error);
    return response.status(500).send("Internal Server Error");
  }
};

export const updateProfile = async (request, response, next) => {
  try {
    const {userId}= request;
    const{firstName, lastName,color}= request.body;
    if(!firstName||!lastName){
      return response.status(400).json({ message: "FirstName,LastName and Color is required" });
    }
  const userData = await User.findByIdAndUpdate(userId,{
    firstName,lastName,color,profileSetup:true
  },{new:true,runValidators:true});


    return response.status(200).json({
        id: userData.id,
        email: userData.email,
        profileSetup: userData.profileSetup,
        firstName:userData.firstName,
        lastName: userData.lastName,
        image: userData.image,
        color: userData.color,
      
    });
  } catch (error) {
    console.log(error);
    return response.status(500).send("Internal Server Error");
  }
};


export const addProfileImage = async (request, response,next) => {
  try {
    // Ensure file exists
    if (!request.file) {
      return response.status(400).json({ error: "File is required" });
    }

    // Generate new filename and move file
    const date = Date.now();
    const filename = `uploads/profiles/${date}-${request.file.originalname}`
    renameSync(request.file.path, filename);

    // Update user with new image path
    const updatedUser = await User.findByIdAndUpdate(
      request.userId,
      { image: filename },
      { new: true, runValidators: true }
    );

    return response.status(200).json({
      message: "Image uploaded successfully",
      image: updatedUser.image,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return response.status(500).json({ error: "Internal Server Error" });
  }
};


export const removeProfileImage = async (request, response, next) => {
  try {
 
   const { userId } = request;
   const user= await User.findById(userId);
   

   if (!user) {
    return response.status(404).send("User not found");
   }

   if (user.image) {
    unlinkSync(user.image)
   }

   user.image =null;
   await user.save();


    return response.status(200).send("Profile Image Removed Successfully");
  } catch (error) {
    console.log(error);
    return response.status(500).send("Internal Server Error");
  }
};