var mongoose = require("mongoose");

const orderDetailSchema = new mongoose.Schema({
  product_id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
});

const orderSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    time: {
      type: Date,
      default: Date.now,
    },
    phone: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "Chưa hoàn thành",
    },
    detail: {
      type: [orderDetailSchema],
      required: true,
    },
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

module.exports = mongoose.model("Order", orderSchema);
