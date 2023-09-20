import express from 'express'
import { getAllCategories, inputCategoriestoDB } from '../controllers/category.js'

const router = express.Router()

router.post('/inputcategory', inputCategoriestoDB)

router.get('/', getAllCategories)

export default router