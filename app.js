import express from "express";
import path from 'path';
import cookieParser from "cookie-parser";
import logger from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

// Routers
import database from "./src/configure/db.connection.js";
database();
import indexRouter from "./src/routes/index.js";
import userRouter from "./src/routes/user.js";
import categoryRouter from "./src/routes/category.js";
import productRouter from "./src/routes/product.js";
import loginRouter from "./src/routes/login.js";
import cartRouter from './src/routes/cart.js';
import orderRouter from './src/routes/order.js';
import shippingAddressRouter from './src/routes/shippingAddress.js';
import paymentRouter from "./src/routes/payment.js";

var app = express();

// Middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// Static files configuration
app.use('/images', express.static(path.resolve('public/images')));

// Routes
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/category', categoryRouter);
app.use('/product', productRouter);
app.use('/login', loginRouter);
app.use('/cart', cartRouter);
app.use('/order', orderRouter);
app.use('/shippingaddress', shippingAddressRouter);
app.use('/payment', paymentRouter);

export default app;
