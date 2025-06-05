import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import {
  cancelSubscription,
  createSubscription,
  delteSubscription,
  getAllSubscriptions,
  getSubscriptionsDetails,
  getUpcomingRenewals,
  getUserSubscriptions,
  updateSubscription,
} from "../controllers/subscription.controller.js";
import { isAdmin } from "../middlewares/isAdmin.middleware.js";

const subscriptionRouter = Router();

subscriptionRouter.get("/", authorize, isAdmin, getAllSubscriptions);

subscriptionRouter.get("/:id", authorize, getSubscriptionsDetails);

subscriptionRouter.post("/", authorize, createSubscription);

subscriptionRouter.put("/:id", authorize, updateSubscription);

subscriptionRouter.delete("/:id", authorize, delteSubscription);

subscriptionRouter.get("/user/:id", authorize, getUserSubscriptions);

subscriptionRouter.put("/:id/cancel", authorize, cancelSubscription);

subscriptionRouter.get("/upcoming-renewals", authorize, getUpcomingRenewals);

export default subscriptionRouter;
