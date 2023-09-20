import Product from "../models/product.js";
import { customError } from "../config/error.js";
import data from "../sampledata.js";
import User from "../models/auth.js"


//send sample data product to MonoDB
export const sendProductToDB= async (req, res, next) =>
{
  await Product.deleteMany({})
  const products = await Product.insertMany(data.products)
  res.status(200).json(products)
}

export const isFeaturedProducts = async(req, res, next) =>
{
  try 
  {
    const products = await Product.find({isFeatured: true})
    if(!products) return next(customError(404, "Cannot find featured products"))
    res.status(200).json(products)
  } catch (error) {
    res.status(500).json(error)
  }
}

export const getProductByCondition = async (req, res, next) =>
{
  try 
  {
    const newProduct = await Product.find({condition: 'New'})
    const preOrder = await Product.find({condition: 'Preorder'})
    
    res.status(200).json(newProduct.concat(preOrder))
    //res.status(200).json(newProduct )

  } catch (error) 
  {
    res.status(500).json(error)
  }
}

export const getPreOrderProducts = async(req, res) =>
{try {
  const preOrder = await Product.find({condition: "Preorder"})
  res.status(200).json(preOrder)
  
} catch (error) 
{
  res.status(500).json(error)
}
  
}

export const getAllProducts = async( req, res) =>
{try{
  const allProducts = await Product.find()
  
  res.status(200).json(allProducts)
}catch(error)
{
  res.status(500).json(error)
}

}

export const getProductByCategory = async(req, res, next) =>
{
  const categoryName = req.params.categoryName
  try 
  {
    const productCategory = await Product.find({category: categoryName})
    res.status(200).json(productCategory)
  } catch (error) 
  {
    res.status(500).json(error)
  }
}

export const getOneProduct = async(req, res, next) =>
{
  const slugTitle = req.params.slugTitle
  try {
        const product = await Product.findOne({slug: slugTitle})
        if(!product) return next(customError(400, "Cannot find User."))
        res.status(200).json(product)
  } catch (error) 
  {
    res.status(500).json(error)
  }
}

export const serachProducts = async(req, res) =>
{
  const searchQuery = req.query.q
  try {
    const product = await Product.find({title: {$regex: searchQuery, $options: 'i'}})
    res.status(200).json(product)
    
  } catch (error) {
    res.status(500).json(error)
  }

}

export const likeAProduct = async(req, res) =>
{
  const id = req.user.id
  const productId = req.params.productId
  try 
  {
    await Product.findByIdAndUpdate(productId,{$addToSet: {likes: id}})
    res.status(200).json('Product Liked.')
  } catch (error) {
    res.status(400).json(error)
  }
}

export const dislikeProduct = async(req, res) =>
{
  const id = req.user.id
  const productId = req.params.productId
  try 
  {
    await Product.findByIdAndUpdate(productId,{$pull: {likes: id}})
    res.status(200).json('Product unliked')
  } catch (error) 
  {
    res.status(400).json(error)
  }
}

export const getSavedProducts = async(req, res) =>
{
  const {username} = req.params
  const id = req.user.id
  try 
  {
    const user = await User.findOne({username})
    if(!user) return next(customError(500, "Cannot find user"))
    if(user)
    {
      const liked = await Product.find({likes: id})
      res.status(200). json(liked)
    }
    
  } catch (error) {
    res.status(500).json(error)
  }
}

export const deleteProduct = async(req, res) =>
{
  try {
    await Product.findByIdAndRemove(req.params.id)
    res.status(200).json('Product deleted successfully')
    
  } catch (error) {
    res.status(500).json(error)
  }
}

export const createNewProduct = async(req, res) =>
{
  try {
    const product = await Product.insertMany(req.body)
    res.status(201).json(product)
    
  } catch (error) {
    res.status(500).json(error)
  }
}