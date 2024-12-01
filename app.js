import express from "express";
import path from 'path';
import cookieParser from "cookie-parser";
import logger from 'morgan';
import database from "./src/configure/db.connection.js";
database()
import indexRouter from "./src/routes/index.js";
import usersRouter from "./src/routes/users.js";

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.resolve('public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

export default app;