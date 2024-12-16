import express from 'express';
import Cart from '../models/cart.model.js';
import verifyTokenAndRole from '../middlewares/auth.middleware.js';
const router = express.Router();

router.post('/get_user_cart',  async (req, res) => {
  try {
    const { userid } = req.body;
    const cartItems = await Cart.find({ userid }).populate('cart.productid');
    res.status(200).json({ status: true, data: cartItems });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ status: false, message: 'Failed to fetch cart data.' });
  }
});

router.post("/add_product_in_cart", async (req, res) => {
  try {
    const { userid, productid, quantity } = req.body;
    let userCart = await Cart.findOne({ userid });

    if (userCart) {
      const productIndex = userCart.cart.findIndex(
        (item) => item.productid.toString() === productid
      );

      if (productIndex > -1) {
        if (quantity < 1) {
          userCart.cart.splice(productIndex, 1);
        } else {
          userCart.cart[productIndex].quantity = quantity;
        }
      } else {
        if (quantity >= 1) {
          userCart.cart.push({ productid, quantity });
        }
      }
    } else {
      if (quantity >= 1) {
        userCart = new Cart({
          userid,
          cart: [{ productid, quantity }],
        });
      }
    }
    const savedCart = await userCart.save();
    res.status(201).json({ status: true, message: "Cart updated.", data: savedCart });
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ status: false, message: "Failed to update cart." });
  }
});


export default router;
