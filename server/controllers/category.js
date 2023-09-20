import Category from "../models/category.js";
import { customError } from "../config/error.js";
import data from "../sampledata.js";

export const inputCategoriestoDB = async(req, res) =>
{
  await Category.deleteMany({})
  const categories = await Category.insertMany(data.categories)
  res.status(200).json(categories)
}

export const getAllCategories = async(req, res) =>
{
  try
  {
    const allCategories = await Category.find()
    res.status(200).json(allCategories)
  } catch (error) 
  {
    res.status(400).json(error)
  }
}