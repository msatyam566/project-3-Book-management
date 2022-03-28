const express = require('express');
const router = express.Router();


const usercontroller = require("../controllers/usercontroller")
const bookcontroller = require("../controllers/bookcontroller")


router.get("/test-me", function(req,res){
    res.send("My api")

})



router.post("/register",usercontroller.userCreate)
router.post("/createBook",bookcontroller.bookCreate)
router.post("/loginuser", usercontroller.userLogin)
router.get("/getBooks",bookcontroller.getBook)
router.get("/books/:bookId",bookcontroller.getBookbyId)
router.put("/books/:bookId", bookcontroller.updateBooksbyId)
router.delete("/books/:bookId",bookcontroller.deletebyid)

module.exports = router;