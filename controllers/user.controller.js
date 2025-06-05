import mongoose from "mongoose";
import User from "../models/user.model.js";
import Subscription from "../models/subscription.model.js";
import bcrypt from "bcryptjs";

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { name, newPassword, newPasswordConfirm, oldPassword } = req.body;
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (name) user.name = name;

    if (newPassword || newPasswordConfirm || oldPassword) {
      if (!newPassword || !newPasswordConfirm || !oldPassword) {
        return res.status(400).json({ message: "Missing password fields" });
      }

      if (newPassword !== newPasswordConfirm) {
        return res.status(400).json({ message: "New passwords do not match" });
      }

      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Old Password is Wrong!" });
      }

      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      user.password = hashedPassword;
    }

    const updatedUser = await user.save();

    res.status(204).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user.userId;
    const { id } = req.params;

    if (userId !== id) return res.status(403).json({ message: "Unauthorized" });

    const user = await User.findById(id).session(session);
    if (!user) return res.status(404).json({ message: "User not found." });

    // First delete subscriptions
    await Subscription.deleteMany({ user: id }).session(session);

    // Second delete user
    await User.findByIdAndDelete(id).session(session);

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Account and related subscriptions deleted successfully",
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};
