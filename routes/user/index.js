const userRouter = require("express").Router();
const userAuthRouter = require("./userAuth");
const userNotificationRouter=require("./userNotification");
const userContentRouter=require("./userContent");

userRouter.use("/auth", userAuthRouter);
userRouter.use("/notification", userNotificationRouter);
userRouter.use("/content", userContentRouter);













module.exports = userRouter;
