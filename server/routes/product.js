import express from "express";
import {
  sendProductToDB,
  getProductByCondition,
  getAllProducts,
  getProductByCategory,
  getOneProduct,
  serachProducts,
  likeAProduct,
  dislikeProduct,
  isFeaturedProducts,
  getPreOrderProducts,
  getSavedProducts,
  deleteProduct,
  createNewProduct
} from "../controllers/product.js";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.post("/inputproducts", sendProductToDB);
router.get("/condition", getProductByCondition);
router.get("/allproducts", getAllProducts);
router.get("/:categoryName", getProductByCategory);
router.get("/title/:slugTitle", getOneProduct)
router.get("/search/product", serachProducts)
router.get('/featured/product', isFeaturedProducts)
router.get("/condition/preorder", getPreOrderProducts)
router.get("/usersaved/:username", verifyToken, getSavedProducts)

router.put("/:productId/likes", verifyToken, likeAProduct)
router.put("/:productId/dislikes", verifyToken, dislikeProduct)


//delete
router.delete("/delete/:id", verifyToken, deleteProduct)

//cewate
router.post("/create", verifyToken, createNewProduct)

export default router;
