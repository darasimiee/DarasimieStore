import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    image:
    {
      type: String,
      required: true,
      unique: true,
    }
  },
  {
    timestamps: true,
  })
  const Category = mongoose.model('Catgory', categorySchema)
  export default Category