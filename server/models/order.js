import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [
      {
        title: { type: String, required: true },
        slug: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        images: { type: [String], required: true },
        category: { type: String, required: true },
        brand: { type: String, required: true },
      },
    ],
    shippingDetails: {
      fullname: { type: String, required: true },
      shippingAddress: { type: String, required: true },
      phone: { type: Number, required: true },
      state: { type: String, required: true },
    },
    shippingPrice: { type: Number, required: true, default: 0.0 },

    taxPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true, default: 0.0 },
    paymentMethod: { type: String, required: true, default: 'Cash' },
    status: {type: Number, default: 0},
    isPaid: {type: Boolean, required: true, default: false},
    isDelivered: {type: Boolean, default: false},
    paidAt: {type: Date},
    deliveredAt: {type: Date},
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
