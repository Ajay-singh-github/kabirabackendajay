// var express = require('express');
import express from 'express';
var router = express.Router();
import UserModel from '../models/user.model.js';
import CategoriesModel from '../models/categories.model.js';
import ProductModel from '../models/product.model.js';
import CartModel from '../models/cart.model.js';
import OrderModel from '../models/order.model.js';
import ShippingaddressModel from '../models/shippingaddress.model.js';
/* GET home page. */
router.get('/create_schema', function(req, res, next) {
  const UM = new UserModel()
  const CM = new CategoriesModel()
  const PM = new ProductModel()
  const CartM = new CartModel()
  const OrderM = new OrderModel()
  const ShippingM = new ShippingaddressModel()
});

export default router