import Order from "../models/order.js";

export const createOrder = async (req, res, next) => {
  const {
    orderItems,
    shippingDetails,
    paymentMethod,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  try {
    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error("No order item");
    } else {
      const order = new Order({
        user: req.user.id,
        orderItems,
        shippingDetails,
        shippingPrice,
        taxPrice,
        totalPrice,
        paymentMethod,
        isPaid: paymentMethod === "Paypal" ? true : false,
        paidAt: paymentMethod === "Paypal" ? Date.now() : "",
        status: paymentMethod === "Paypal" ? 1 : 0,
      });
      const createOrder = await order.save();
      res.status(201).json(createOrder);
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

//Get user orders
export const getUserOrders = async (req, res) => {
  try {
    const order = await Order.find({ user: req.user.id }).sort({ _id: -1 });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json(error);
  }
};

//Admin shop order history
export const getAllOrdersByAdmin = async (req, res) => {
  try {
    const orders = await Order.find().sort({ _id: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json(error);
  }
};

//get order detail
export const getOrderDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id).populate("user", "username email");
    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error("Order not found");
    }
  } catch (error) {
    res.status(500).json(error);
  }

};

//track an order
export const trackOrders = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (order.paymentMethod === "Cash" && order.status === 2) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }
    if (order.paymentMethod === "Paypal" && order.status === 2) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }
    const updatedOrder = await order.save();
    res.status(201).json(updatedOrder);
  } catch (error) {
    res.status(500).json(error);
  }
};
