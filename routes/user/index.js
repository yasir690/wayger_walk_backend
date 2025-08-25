const userRouter = require("express").Router();
const userAuthRouter = require("./userAuth");
const userNotificationRouter=require("./userNotification");


userRouter.use("/auth", userAuthRouter);
userRouter.use("/notification", userAuthRouter);












module.exports = userRouter;
