const express = require('express');
const router = express.Router();


const usercontroller = require("../controllers/usercontroller")
const bookcontroller = require("../controllers/bookcontroller")
const reviewcontroller = require("../controllers/reviewcontroller")
const auth = require("../middleware/auth")



//----------- User-----------//
router.post("/register",usercontroller.userCreate)
router.post("/loginuser", usercontroller.userLogin)

//-----------Books-----------//
router.post("/createBook",auth.authentication,bookcontroller.bookCreate)
router.get("/getBooks",auth.authentication,bookcontroller.getBook)
router.get("/books/:bookId",auth.authentication,bookcontroller.getBookbyId)
router.put("/books/:bookId",auth.authentication,bookcontroller.updateBooksbyId)
router.delete("/books/:bookId",auth.authentication,bookcontroller.deletebyid)

//-----------review-----------//
router.post("/books/:bookId/review",reviewcontroller.reviewCreate)
router.put("/books/:bookId/review/:reviewId",reviewcontroller.reviewUpdate)
router.delete("/books/:bookId/review/:reviewId",reviewcontroller.reviewDelete)



module.exports = router;