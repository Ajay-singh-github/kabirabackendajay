import express from 'express';
import payment from '../models/payment.model.js';
import Order from "../models/order.model.js";
import verifyTokenAndRole from '../middlewares/auth.middleware.js';
const router = express.Router();

router.post("/add_payments", async (req, res) => {
  try {
    const { userid, paymentmode, paymentstatus, paymentamount, transactiondetails, orderid } = req.body;

    const newPayment = new payment({
      userid,
      paymentmode,
      paymentstatus,
      paymentamount,
      transactiondetails,
      orderid,
    });

    await newPayment.save();

    res.status(201).json({ message: "Payment saved successfully" });
  } catch (error) {
    console.error("Error saving payment:", error);
    res.status(500).json({ message: "Failed to save payment", error });
  }
});



router.get('/total-sales', async (req, res) => {
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


  router.get("/total-sales/yearly",verifyTokenAndRole(["admin"]), async (req, res) => {
    try {
      const year = 2025; // You can pass this dynamically based on the user's request
  
      const totalSales = await Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: new Date(`${year}-01-01`), // Start date (January 1st of the year)
              $lt: new Date(`${year + 1}-01-01`), // End date (January 1st of the next year)
            },
          },
        },
        {
          $group: {
            _id: null, // Group by null to sum up all orders
            total: { $sum: "$totalamount" }, // Sum the totalamount of all orders
          },
        },
      ]);
  
      if (totalSales.length > 0) {
        return res.status(200).json({ status: true, totalSales: totalSales[0].total });
      } else {
        return res.status(200).json({ status: true, totalSales: 0 });
      }
    } catch (error) {
      console.error("Error calculating yearly total sales:", error.message);
      return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
  });

 router.get('/get_all_payment',async function(req, res, next) {
      try{
      var paymenta = await payment.find({})  
      res.status(200).json({ status: true, message: "Get Data Successfully",data:paymenta })
      }catch(e){
          res.status(500).json({ status: false, message: "Server Error" })
        }
      });


      router.get("/get_payment_by_orderid", async (req, res) => {
        try {
          const { orderid } = req.query;
      
          if (!orderid) {
            return res.status(400).json({ status: false, message: "Order ID is required" });
          }
      
          const Payment = await payment.findOne({ orderid: orderid }).populate("userid");
      
          if (!Payment) {
            return res.status(404).json({ status: false, message: "Payment details not found for this order" });
          }
      
          return res.status(200).json({
            status: true,
            Payment,
          });
        } catch (error) {
          console.error("Error fetching payment details by order ID:", error);
          return res.status(500).json({ status: false, message: "Server error", error: error.message });
        }
      });      

export default router;
