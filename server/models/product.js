import mongoose from "mongoose";
import mongooseSlugPlugin from "mongoose-slug-plugin";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    color: {
      type: String,
    },
    extra: {
      type: [String],
    },
    isFeatured: {
      type: Boolean,
    },
    condition: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    likes: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);


const Product = mongoose.model(
  "Product",
  productSchema.plugin(mongooseSlugPlugin, { tmpl: "<%=title%>" })
);

export default Product;
