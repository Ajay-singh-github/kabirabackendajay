import express from 'express';
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";

import verifyTokenAndRole from '../middlewares/auth.middleware.js';
import mongoose from "mongoose";

const router = express.Router();

router.post('/add_order', async (req, res) => {
  try {
    const { userid , items , totalamount , orderstatus ,shippingid} = req.body;

    if (!userid  || !totalamount || !orderstatus) {
      return res.status(400).json({ status: false, message: "all fields are required." });
    }
    
    const Amount = items.reduce((total, item) => {
      return total + (item.quantity) * (item.saleprice);
    }, 0);

    

    if (totalamount !== Amount) {
      return res.status(400).json({
        status: false,
        data: [],
        message: 'Total Amount is not valid. Something went wrong.',
      });
    }

    console.log("AMOUNT:",Amount)

      const newOrder = new Order({
        userid: userid,
        items:items,
        totalamount:totalamount,
        orderstatus:orderstatus,
        shippingid:shippingid,
        
      });

      const savedOrder = await newOrder.save();
      
      if (savedOrder) {
        return res.status(200).json({
          status: true,
          data:savedOrder,
          totalAmount:Amount,
          message: 'Address saved and order created successfully!',
        });

      }

      return res.status(500).json({
        status: false,
        data:[],
        message: 'your Order has been failed.',
      });
    
  } catch (error) {
    console.error('Error while ordering:', error);
    return res.status(500).json({
      status: false,
      error: error.message,
    });
  }
});
//verifyTokenAndRole(["admin"])
router.get('/total-orders', async (req, res) => {
  try {
   
    const totalOrdersCount = await Order.countDocuments();
    
    
    
    res.status(200).json({
      status: true,
      message: "Total orders calculated successfully",
      totalOrders: totalOrdersCount
     
    });
  } catch (error) {
    console.log("DDDDDDDDDDDDD:",error)
    res.status(500).json({
      status: false,
      message: "Error calculating total orders",
      error: error.message
    });
  }
});




router.get('/all-orders', async (req, res) => {
  try {
   
    const allOrders = await Order.find({}).populate('userid');
    
    res.status(200).json({
      status: true,
      message: "Get successfully",
      allorders: allOrders
     
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error while get all orders",
      error: error.message
    });
  }
});



router.post('/cashondelivery_for_order', async (req, res) => {
  try {
    const { userid, items, totalamount, paymentstatus, paymentmethod, orderstatus } = req.body;

    if (!userid || !items || !totalamount || !paymentstatus || !paymentmethod || !orderstatus) {
      return res.status(400).json({
        status: false,
        message: 'All fields are required',
      });
    }

    let existingOrder = await Order.findOne({ "userid": userid });

    if (existingOrder) {
      existingOrder.items = items; 
      existingOrder.totalamount = totalamount; 
      existingOrder.paymentstatus = paymentstatus; 
      existingOrder.paymentmode = "cash on delivery"; 
      existingOrder.orderstatus = orderstatus; 

      const updatedOrder = await existingOrder.save();

      return res.status(200).json({
        status: true,
        message: 'Address updated successfully',
        data: updatedOrder,
      });
    }
  } catch (error) {
    console.error('Error saving cash on delivery order:', error);
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
});

router.post('/razorpay', async (req, res) => {
  try {
    const { paymentData } = req.body;

    console.log('Received Razorpay Payment Data:', paymentData);

    res.status(200).json({
      status: true,
      message: 'Payment successfully processed',
    });
  } catch (error) {
    console.error('Error in processing payment:', error);
    res.status(500).json({
      status: false,
      error: error.message,
    });
  }
});


router.get("/orders/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const userOrders = await Order.find({ "userid": userId })
    .populate("shippingid", "address");
    if (userOrders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user." ,status:false});
    }

    res.status(200).json({
      totalOrders: userOrders.length,
      orders: userOrders,
      status:true
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "An error occurred while fetching orders." ,status:false});
  }
});


router.post('/get_orders_by_userid', async (req, res) => {
  const { userid } = req.body;

  try {
    const userOrders = await Order.find({ userid })
      .populate('shippingid', 'address') // Populate the shipping address
      .populate('userid', 'name email'); // Populate user info like name and email

    if (!userOrders || userOrders.length === 0) {
      return res.status(404).json({
        message: 'No orders found for this user.',
        status: false,
      });
    }

    res.status(200).json({
      totalOrders: userOrders.length,
      orders: userOrders,
      status: true,
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      message: 'An error occurred while fetching orders.',
      status: false,
    });
  }
});





router.get("/search",verifyTokenAndRole(["admin"]), async (req, res) => {
  try {
    const { searchTerm } = req.query;

    if (!searchTerm) {
      return res.status(400).json({ status: false, message: "Search term is required" });
    }

    const searchRegex = new RegExp(searchTerm, "i");
    const query = [];

    if (mongoose.Types.ObjectId.isValid(searchTerm)) {
      query.push({ _id: searchTerm });
    }

    query.push({ orderstatus: searchRegex });

    const users = await User.find({ name: searchRegex });
    if (users.length > 0) {
      const userIds = users.map((user) => user._id);
      query.push({ userid: { $in: userIds } });
    }

    const orders = await Order.find({ $or: query }).populate("userid", "name");

    res.status(200).json({ status: true, orders });
  } catch (error) {
    console.error("Error while searching orders:", error.message);
    res.status(500).json({ status: false, message: "Internal Server Error" });
  }
});


router.post('/update_status',verifyTokenAndRole(["admin"]), async (req, res) => {
  const { orderId } = req.body
  const { orderstatus } = req.body;  

  if (!['pending', 'completed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'].includes(orderstatus)) {
    return res.status(400).json({ message: 'Invalid order status' });
  }

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { orderstatus },  
      { new: true } 
    );

    if (!updatedOrder) {
      console.log("SSSSSSSSSSSSSSSSSSSSSSS:",)
      return res.status(404).json({status:"false", message: 'Order not found' });
    }

    return res.status(200).json({status:"true", message: 'Order status updated successfully', order: updatedOrder });
  } catch (error) {
    console.error(error);
    return res.status(500).json({status:"false", message: 'Internal server error' });
  }
});



router.get('/dashboard/best-sellers', async (req, res) => {
  try {

  } catch (error) {
      
  }
});



router.get('/dashboard/sales-data', async (req, res) => {
  try {
      const { timePeriod } = req.query; 

      let groupByFormat;
      if (timePeriod === 'weekly') {
          groupByFormat = { week: { $isoWeek: '$createdAt' }, year: { $year: '$createdAt' } };
      } else if (timePeriod === 'monthly') {
          groupByFormat = { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } };
      } else if (timePeriod === 'yearly') {
          groupByFormat = { year: { $year: '$createdAt' } };
      } else {
          return res.status(400).json({ success: false, message: 'Invalid timePeriod parameter.' });
      }

      const salesData = await Order.aggregate([
          {
              $group: {
                  _id: groupByFormat,
                  totalSales: { $sum: '$totalamount' }, 
                  orderCount: { $sum: 1 }, 
              },
          },
          {
              $sort: { '_id.year': 1, '_id.month': 1, '_id.week': 1 }, 
          },
      ]);

      const formattedData = salesData.map((data) => ({
          period: `${data._id.year}-${data._id.month || data._id.week || ''}`.trim(),
          totalSales: data.totalSales,
          orderCount: data.orderCount,
      }));

      res.status(200).json({
          success: true,
          data: formattedData,
      });
  } catch (error) {
      console.error('Error fetching sales data:', error);
      res.status(500).json({
          success: false,
          message: 'Something went wrong while fetching sales data.',
      });
  }
});





export default router;
