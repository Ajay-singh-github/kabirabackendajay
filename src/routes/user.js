import express from 'express';
var router = express.Router();
import User from "../models/user.model.js";
import bcryptController from "../controllers/bcryptController.js";
import verifyTokenAndRole from '../middlewares/auth.middleware.js';

router.post('/create_user', async (req, res) => {
  try {
    const { emailid, phonenumber, password, name, role, address } = req.body;
    if (!emailid || !password || !phonenumber) {
      return res.status(400).json({
        status: false,
        message: "Email ID, Phone Number, and Password are required.",
      });
    }

    const emailExists = await User.findOne({ emailid });
    if (emailExists) {
      return res.status(409).json({
        status: false,
        message: `The email ID '${emailid}' is already registered.`,
      });
    }

    const phoneExists = await User.findOne({ phonenumber });
    if (phoneExists) {
      return res.status(409).json({
        status: false,
        message: `The phone number '${phonenumber}' is already registered.`,
      });
    }

    const hashedPassword = await bcryptController.hashPassword(password);

    const user = new User({
      emailid,
      phonenumber,
      password: hashedPassword,
      name,
      role,
      address,
    });

    const savedUser = await user.save();

    res.status(201).json({
      status: true,
      message: "User created successfully.",
      data: savedUser,
    });
  } catch (e) {
    if (e.code === 11000) {
      return res.status(409).json({
        status: false,
        message: "Duplicate key error. Please use a unique value.",
        error: e.keyValue,
      });
    }
    console.error("Error in /create_user:", e);
    res.status(500).json({
      status: false,
      message: "Internal Server Error",
    });
  }
});



  router.get('/get_all_user',verifyTokenAndRole(["admin"]), async function (req, res, next) {
    try {
      var user = await User.find()
      res.status(200).json({ status: true, message: "Get Data Successfully", data: user })
    } catch (e) {
      console.log("sssssssssssssssssssssssss:", e)
      res.status(500).json({ status: false, message: "Server Error" })
  
    }
  });
  

  router.post('/get_specific_user', async function (req, res) {
    try {
      const { userid } = req.body;
  
      
      if (!userid) {
        return res.status(400).json({ status: false, message: "User ID is required" });
      }
  
      const user = await User.findOne({ _id: userid }).select("-password");
  
      if (user) {
        res.status(200).json({ status: true, message: "User verified successfully", data: user });
      } else {
        res.status(404).json({ status: false, message: "User not found" });
      }
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ status: false, message: "Internal server error" });
    }
  });
  


  router.put('/update_user',verifyTokenAndRole(["admin","user"]), async function (req, res, next) {
    try {
      const { userid } = req.body
      const updateData = req.body
      const updatedUser = await User.findOneAndUpdate(
        { _id: userid },          // Search condition
        { $set: updateData },      // Updated data
        { new: true }              // Return the updated document
      );
  
      if (!updatedUser) {
        return res.status(404).json({
          status: false,
          message: "User not found"
        });
      }
  
      res.status(200).json({
        status: true,
        message: "User updated successfully",
        data: updatedUser
      });
  
    } catch (e) {
      console.log("sssssssssssssssssssssssss:", e)
      res.status(500).json({ status: false, message: "Server Error" })
  
    }
  
  });


  router.delete('/delete_user',verifyTokenAndRole(["admin","user"]), async function (req, res, next) {
    try {
      const { userid } = req.body
  
      const deletedUser = await User.findOneAndDelete({ _id: userid });
  
      if (!deletedUser) {
        return res.status(404).json({
          status: false,
          message: "User not found"
        });
      }
  
      res.status(200).json({
        status: true,
        message: "User deleted successfully",
        data: deletedUser
      });
  
    } catch (e) {
      res.status(500).json({ status: false, message: "Server Error" })
    }
  });

  router.get("/by-date/:date",verifyTokenAndRole(['admin']), async (req, res) => {
    try {
      const { date } = req.params;
  
      const targetDate = new Date(date);
  
      if (isNaN(targetDate.getTime())) {
        return res.status(400).json({
          status: false,
          message: "Invalid date format. Use YYYY-MM-DD.",
        });
      }
  
      
      const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999)); 
  
  
      const users = await User.aggregate([
        {
          $match: {
            createdAt: { $lte: endOfDay }, 
            role: "user",                                   
          },
        },
        {
          $count: "totalUsers",                              
        },
      ]);
  
      if (users.length === 0) {
        return res.status(200).json({
          status: true,
          message: "No users found for the specified date.",
          data: [],
        });
      }
  
      return res.status(200).json({ status: true, data: users });
    } catch (error) {
      console.error("Error fetching users by date:", error);
      return res
        .status(500)
        .json({ status: false, message: "Server error while fetching users." });
    }
  });


  router.post('/change-password',verifyTokenAndRole(["admin","user"]), async (req, res) => {
    const { currentPassword, newPassword } = req.body;
  
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ status: false, message: "Please provide both current and new passwords" });
    }
    try {
      const userId = req.data.id; 
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ status: false, message: "User not found" });
      }
  
      const isMatch = await bcryptController.comparePassword(currentPassword, user.password);
      
      if (!isMatch) {
        return res.status(400).json({ status: false, message: "Current password is incorrect" });
      }
  
      const hashedNewPassword = await bcryptController.hashPassword(newPassword, 10);
  
      user.password = hashedNewPassword;
      await user.save();
  
      res.status(200).json({ status: true, message: "Password changed successfully" });
  
    } catch (error) {
      console.log("PASSword CHANGE:",error)
      res.status(500).json({ status: false, message: "Server error", error: error.message });
    }
  });



 
  
  
  

export default router;
