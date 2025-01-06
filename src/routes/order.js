import express from 'express';
import Order from "../models/order.model.js";
import verifyTokenAndRole from '../middlewares/auth.middleware.js';

const router = express.Router();

// Add/Update address for an order
router.post('/add_order', async (req, res) => {
  try {
    const { userid , items , totalamount , orderstatus ,shippingid} = req.body;

    if (!userid  || !totalamount || !orderstatus) {
      return res.status(400).json({ status: false, message: "all fields are required." });
    }
    
    
      const newOrder = new Order({
        userid: userid,
        items:items,
        totalamount:totalamount,
        orderstatus:orderstatus,
        shippingid:shippingid
        // paymentid:paymentid
      });

      const savedOrder = await newOrder.save();
      const Amount = items.reduce((total, item) => {
        return total + (item.quantity) * (item.saleprice);
      }, 0);

      console.log("AMOUNT:",Amount)
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


router.get('/total-orders',verifyTokenAndRole(["admin"]), async (req, res) => {
  try {
    // Count total orders
    const totalOrders = await Order.countDocuments();

    res.status(200).json({
      status: true,
      message: "Total orders calculated successfully",
      totalOrders: totalOrders
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error calculating total orders",
      error: error.message
    });
  }
});


// Handle cash on delivery order
router.post('/cashondelivery_for_order', async (req, res) => {
  try {
    const { userid, items, totalamount, paymentstatus, paymentmethod, orderstatus } = req.body;

    // Validate the presence of necessary data
    if (!userid || !items || !totalamount || !paymentstatus || !paymentmethod || !orderstatus) {
      return res.status(400).json({
        status: false,
        message: 'All fields are required',
      });
    }

    // Check if an order already exists for the given userId
    let existingOrder = await Order.findOne({ "userid": userid });

    if (existingOrder) {
      // Update only the address in the existing order
      existingOrder.items = items; // Set the new address
      existingOrder.totalamount = totalamount; // Set the new address
      existingOrder.paymentstatus = paymentstatus; // Set the new address
      existingOrder.paymentmode = "cash on delivery"; // Set the new address
      existingOrder.orderstatus = orderstatus; // Set the new address

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

// Handle Razorpay payment success callback
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

export default router;
