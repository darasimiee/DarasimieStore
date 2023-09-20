import express from "express"
import { registerUSer, loginUser, getSingleUser, updateUser } from "../controllers/auth.js"
import { verifyToken} from "../middleware/verifyToken.js"


const router = express.Router()
//Post request
router.post('/register', registerUSer)
router.post('/login', loginUser)

//get request
router.get('/user-profile/:username',verifyToken, getSingleUser)

//put request for updating
router.put('/update-profile', verifyToken,updateUser)


export default router
