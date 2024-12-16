

import express from 'express';
import payment from '../models/payment.model.js';
import verifyTokenAndRole from '../middlewares/auth.middleware.js';
const router = express.Router();

router.post('/add_payment_status_by_order', async (req, res) => {
  try {
    const { userid, paymentmode , paymentamount , transactiondetails } = req.body;

    if (!userid || !paymentmode || !paymentamount) {
      return res.status(400).json({ status: false, message: "All Fields Are Required to further Process." });
    }
    
      const newOrder = new payment({
        userid: userid,
        paymentmode:paymentmode,
        paymentamount:paymentamount,
        transactiondetails:transactiondetails
      });

      const savedPayment = await newOrder.save();
      if (savedPayment) {
        return res.status(200).json({
          status: true,
          data:savedPayment,
          message: 'Payment saved successfully!',
        });
      }

      return res.status(500).json({
        status: false,
        message: 'Failed to save address and create order',
      });
   
  } catch (error) {
    console.error('Error saving/updating address:', error);
    return res.status(500).json({
      status: false,
      error: error.message,
    });
  }
});


router.get('/total-sales',verifyTokenAndRole(["admin"]), async (req, res) => {
    try {
      const totalSales = await payment.aggregate([
        {
          $group: {
            _id: null, // No grouping by a specific field, so we keep it null
            totalAmount: { $sum: "$paymentamount" } // Sum the paymentamount field
          }
        }
      ]);
  
      const totalAmount = totalSales.length > 0 ? totalSales[0].totalAmount : 0;
  
      res.status(200).json({
        status: true,
        message: "Total sales calculated successfully",
        totalSales: totalAmount
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Error calculating total sales",
        error: error.message
      });
    }
  });





export default router;
