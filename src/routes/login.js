import express from 'express';
var router = express.Router();
import jwt from 'jsonwebtoken';
import bcryptController from "../controllers/bcryptController.js";
import User from "../models/user.model.js";
import verifyTokenAndRole from '../middlewares/auth.middleware.js';

router.post('/admin_login', async (req, res) => {
    try {
      const { emailid, password, phonenumber } = req.body;
      if (!emailid || !password || !phonenumber) {
        return res.status(400).json({
          status: false,
          message: "Email ID, Password, and Phone Number are required for admin login.",
        });
      }
        const admin = await User.findOne({ emailid, phonenumber, role: "admin" });
      if (!admin) {
        return res.status(404).json({
          status: false,
          message: "Admin not found or credentials are incorrect.",
        });
      }
        const isPasswordValid = await bcryptController.comparePassword(password, admin.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          status: false,
          message: "Invalid password.",
        });
      }
        const token = jwt.sign({ id: admin._id, role: admin.role }, "shhhh", { expiresIn: "1h" });
      res.status(200).json({
        status: true,
        message: "Admin logged in successfully.",
        data: admin,
        token,
      });
    } catch (error) {
      console.error("Error during admin login:", error);
      res.status(500).json({
        status: false,
        message: "Server error.",
      });
    }
  });
  
  
  router.post('/user_login', async (req, res) => {
    try {
      const { emailid, password } = req.body;
  
      if (!emailid || !password) {
        return res.status(400).json({
          status: false,
          message: "Email ID and Password are required for user login.",
        });
      }
  
      const user = await User.findOne({ emailid, role: "user" });
      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found or credentials are incorrect.",
        });
      }
  
      const isPasswordValid = await bcryptController.comparePassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          status: false,
          message: "Invalid password.",
        });
      }
  
      user.password = undefined;

      const token = jwt.sign({ id: user._id, role: user.role }, "shhhh", { expiresIn: "1h" });
  
      res.status(200).json({
        status: true,
        message: "User logged in successfully.",
        data: user,
        token,
      });
    } catch (error) {
      console.error("Error during user login:", error);
      res.status(500).json({
        status: false,
        message: "Server error.",
      });
    }
  });

export default router;
