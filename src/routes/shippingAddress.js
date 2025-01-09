import express from 'express';
import shippingaddress from '../models/shippingaddress.model.js';
const router = express.Router();

router.post('/add_address_for_order', async (req, res) => {
  try {
    const { userid, address } = req.body;

    if (!userid || !address) {
      return res.status(400).json({ status: false, message: "UserId and address are required" });
    }
    
    let existingOrder = await shippingaddress.findOne({ "userid": userid });

    if (existingOrder) {
      existingOrder.address = address;
      const updatedOrder = await existingOrder.save();

      return res.status(200).json({
        status: true,
        message: 'Address updated successfully',
        data: updatedOrder,
      });
    } else {
      const newOrder = new shippingaddress({
        userid: userid,
        address,
      });

      const savedOrder = await newOrder.save();
      if (savedOrder) {
        return res.status(200).json({
          status: true,
          message: 'Address saved and order created successfully!',
        });
      }

      return res.status(500).json({
        status: false,
        message: 'Failed to save address and create order',
      });
    }
  } catch (error) {
    console.error('Error saving/updating address:', error);
    return res.status(500).json({
      status: false,
      error: error.message,
    });
  }
});


router.post('/fetch_shipping_address_by_userid', async (req, res) => {
    try {
      const { userid } = req.body;
  
      if (!userid) {
        return res.status(400).json({
          status: false,
          message: 'User ID is required.',
        });
      }
  
      const shippingAddress = await shippingaddress.findOne({ userid });
  
      if (!shippingAddress) {
        return res.status(404).json({
          status: false,
          message: 'Shipping address not found for the given User ID.',
          data:[]
        });
      }
  
      return res.status(200).json({
        status: true,
        message: 'Shipping address fetched successfully.',
        data: shippingAddress,
      });
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: 'Internal Server Error.',
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

export default router;
