import { workflowClient } from "../config/upstash.js";
import Subscription from "../models/subscription.model.js";
import { SERVER_URL } from "../config/env.js";
import { canAccessSubscription } from "../utils/authorization.js";
import dayjs from "dayjs";

export const getAllSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find().populate(
      "user",
      "name email"
    );

    res.status(200).json({
      success: true,
      count: subscriptions.length,
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
};

export const getSubscriptionsDetails = async (req, res, next) => {
  try {
    const { id } = req.params;

    const subscription = await Subscription.findById(id).populate(
      "user",
      "name email"
    );

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    if (!canAccessSubscription(subscription, req.user)) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });

    const { workflowRunId } = await workflowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
      body: {
        subscriptionId: subscription.id,
      },
      headers: {
        "content-type": "application/json",
      },
      retries: 0,
    });

    res
      .status(201)
      .json({ success: true, data: { subscription, workflowRunId } });
  } catch (error) {
    next(error);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      price,
      currency,
      frequency,
      category,
      paymentMethod,
      startDate,
    } = req.body;

    const subscription = await Subscription.findById(id).populate(
      "user",
      "_id"
    );

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    if (!canAccessSubscription(subscription, req.user)) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (name) subscription.name = name;
    if (price) subscription.price = price;
    if (currency) subscription.currency = currency;
    if (frequency) subscription.frequency = frequency;
    if (category) subscription.category = category;
    if (paymentMethod) subscription.paymentMethod = paymentMethod;
    if (startDate) subscription.startDate = new Date(startDate);

    const updatedSubscription = await subscription.save();

    res.status(200).json({
      success: true,
      message: "Subscription updated successfully",
      MongoCryptCreateDataKeyError: updatedSubscription,
    });
  } catch (error) {
    next(error);
  }
};

export const delteSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findById(id).populate(
      "user",
      "_id"
    );

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    if (!canAccessSubscription(subscription, req.user)) {
      return res.status(403).json({ message: "Access denied" });
    }

    await subscription.deleteOne();

    res.status(200).json({
      success: true,
      message: "Subscription deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getUserSubscriptions = async (req, res, next) => {
  try {
    // Check if the user is the same as the one in the token
    if (req.user._id === req.params.id) {
      const error = new Error("You are not the owner of this account");
      error.status = 401;
      throw error;
    }

    const subscriptions = await Subscription.find({ user: req.params.id });
    res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
};

export const cancelSubscription = async (req, res, next) => {
  try {
    const { id } = req.params;

    const subscription = await Subscription.findById(id).populate(
      "user",
      "_id"
    );

    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    if (!canAccessSubscription(subscription, req.user)) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (subscription.status === "cancelled") {
      return res
        .status(400)
        .json({ message: "Subscription is already cancelled" });
    }

    subscription.status = "cancelled";
    const cancelled = await subscription.save();

    res.status(200).json({
      success: true,
      message: "Subscription cancelled successfully",
      data: cancelled,
    });
  } catch (error) {
    next(error);
  }
};

export const getUpcomingRenewals = async (req, res, next) => {
  try {
    const now = dayjs();
    const nextWeek = now.add(7, "day");

    const filter = {
      renewalDate: { $gte: now.toDate(), $lte: nextWeek.toDate() },
      status: "active",
    };

    // If admin, let him see all. If user, only his own subscriptions
    if (!req.user.isAdmin) {
      filter.user = req.user._id;
    }

    const subscriptions = await Subscription.find(filter).sort({
      renewalDate: 1,
    });

    const response = subscriptions.map((sub) => ({
      _id: sub._id,
      name: sub.name,
      renewalDate: sub.renewalDate,
      daysUntilRenewal: dayjs(sub.renewalDate).diff(now, "day"),
      currency: sub.currency,
      price: sub.price,
      frequency: sub.frequency,
      category: sub.category,
      status: sub.status,
    }));

    res.status(200).json({
      success: true,
      count: response.length,
      data: response,
    });
  } catch (error) {
    next(error);
  }
};
