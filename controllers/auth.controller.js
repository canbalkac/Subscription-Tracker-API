import mongoose from 'mongoose'
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";
import {JWT_EXPIRES_IN, JWT_SECRET} from "../config/env.js";

export const signUp = async(req,res,next)=>{
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        // Logic to create a new user
        const { name, email, password } = req.body;

        // Check if a user already exists
        const existingUser = await User.findOne({email})

        if(existingUser){
            const error = new Error('User already exists');
            error.statusCode = 409;
            throw error;
        }

        // Hash password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a user
        const newUsers = await User.create([{name, email, password: hashedPassword}], {session}) // added session if some error occurs we won't create use

        // Generate token
        const token = jwt.sign({userId: newUsers[0]._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

        // Everything is good commit and end session
        await session.commitTransaction();
        session.endSession();

        // Return the user
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                token,
                user: newUsers[0],
            }
        })
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
}

export const signIn = async(req,res,next)=>{
    try {
        const { email, password } = req.body;

        const user = await User.findOne({email})

        if(!user){
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if(!isPasswordValid){
            const error = new Error('Invalid password');
            error.statusCode = 401;
            throw error;
        }

        const token = jwt.sign({userId: user._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

        res.status(200).json({
            success: true,
            message: 'User signed successfully',
            data:{
                token,
                user
            }
        })
    } catch (error) {
        next(error);
    }
}

export const signOut = async(req,res,next)=>{}