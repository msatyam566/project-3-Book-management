const bookModel = require("../models/bookModel")
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const mongoose= require("mongoose");
const reviewModel = require("../models/reviewModel");



const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}


const bookCreate = async function (req, res) {
    try {
        let data = req.body;
        const { title, ISBN, userId } = req.body

        if (Object.entries(data).length == 0) {
            return res.status(400).send({ status: false, msg: "please provide some data" })
        }

         else {
            let title = req.body.title
            if (!title)
                return res.status(400).send({ status: false, msg: " enter valid title" })

                let trimname =title.trim()
                if(!(/^(\w+\s)*\w+$/.test(trimname))){
                    return res.status(400).send({ status: false, msg: "Please give a valid title without space" })
            
                }

            let excerpt = req.body.excerpt
            if (!excerpt)
                return res.status(400).send({ status: false, msg: "enter valid excerpt" })

            let userId = req.body.userId
            if (!userId)
                return res.status(400).send({ status: false, msg: "enter valid userId" })
            
            let ISBN = req.body.ISBN
            if (!ISBN){
                return res.status(400).send({ status: false, msg: "please provide ISBN" })

            }
            let category = req.body.category
            if (!category)
               { return res.status(400).send({ status: false, msg: "please provide category" })}

            let subcategory = req.body.subcategory
            if (!subcategory)
               { return res.status(400).send({ status: false, msg: "please provide subcategory" })}

            let reviews = req.body.reviews
            if (!reviews)
               { return res.status(400).send({ status: false, msg: "please provide reviews" })}


            let isvalidISBN =   /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(ISBN)
            if(!isvalidISBN){
                return res.status(400).send({ status: false, msg: "please provide valid ISBN" })
            }

            
            let validtitle = await bookModel.findOne({ title })
            if (validtitle) {
                return res.status(401).send({ status: false, msg: " title already exist" })
            }

            let validISBN = await bookModel.findOne({ ISBN })
            if (validISBN) {
                return res.status(401).send({ status: false, msg: "ISBN already exist" })
            }
             if (!isValidObjectId(userId)) {
                return res.status(400).send({ status: false, message: `${userId} is not a valid user id` })
                
            }
            let releasedAt =req.body.releasedAt
            if(!releasedAt)
               { return res.status(400).send({status :false,msg :"please provide released date"})}

            if(!/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(releasedAt)) {
               return res.status(400).send({ status: false, message: ' \"YYYY-MM-DD\" only this  Date format Accepted ' })

               
            }

        
        let user = await userModel.findOne({ _id: data.userId })
        if (!user) {
            return res.status(401).send({ status: false, message: 'User does not exit' })

        }

       
        let savedData = await bookModel.create( data )
        return res.status(201).send({ status: true, msg: savedData });
        }
    
    }
    catch (error) {
    console.log(error)
    return res.status(500).send({ status: false, msg: error.message })
}
}







const getBook = async function (req, res) {
    try {
        let query = req.query
        let filter = {
            isDeleted: false,
            isPublished: true,
            ...query
        }

        const filterByQuery = await bookModel.find(filter).sort({ title: 1 }).select({ ISBN: 0, subcategory: 0, isDeleted: 0, deletedAt: 0, createdAt: 0, updatedAt: 0 })
        if (filterByQuery.length == 0) {
            return res.status(404).send({ status: false, msg: "No book found" })
        }
        console.log("Data fetched successfully")
        return res.status(200).send({ status: true, msg: "Books list", data: filterByQuery })
    }
    catch (err) {
        console.log(err)
        res.status(500).send({ status: false, msg: err.message })
    }
}


const getBookbyId = async function (req, res) { 
        try {
            let bookId = req.params.bookId;
            if(!isValidObjectId(bookId)){
                return res.status(404).send({ status: false, msg: "enter body params" })
            }
            let count=await reviewModel.find({ bookId: bookId,isDeleted:false }).count()
            const Book =await bookModel.findOneAndUpdate({ _id: bookId },{reviews:count},{new:true});
        
             if (!Book) {
                 return res.status(404).send({ status: false, msg: "No book found" })
             }
            
            let reviews=await reviewModel.find({ bookId: bookId,isDeleted:false })
            let bookwithreview = JSON.parse(JSON.stringify(Book))
              bookwithreview.reviewsData = [...reviews]
            return res.status(200).send({ status: true,message:'Books list', data:bookwithreview })
        }
        catch (err) {
            console.log(err)
            res.status(500).send({ status: false, msg: err.message })
        }
    }



const updateBooksbyId = async function (req, res) {
    try {
        let data = req.params.bookId
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, msg: "please provide some params" })
        }
        let book = await bookModel.findById({ _id: data, isDeleted: false })
        if (!book) return res.status(404).send({ status: false, message: "data is not available" })
        let bookData = req.body
        if (Object.keys(bookData).length == 0) {
            return res.status(400).send({ status: false, msg: "please provide some data" })
        }
        let title = await bookModel.findOne({ title: bookData.title })
        if (title) return res.status(400).send({ status: false, message: "this title is already present try another" })

        let ISBN = await bookModel.findOne({ ISBN: bookData.ISBN })
        if (ISBN) return res.status(400).send({ status: false, message: "this ISBN is already present try another" })

        let updatedbook = await bookModel.findOneAndUpdate({ _id: data }, bookData, { new: true })

        res.status(200).send({ status: true, message: 'success', data: updatedbook });

    }
    catch (error) {
        console.log(error)
        return res.status(500).send({ status: false, msg: error.message })
    }
}
const deletebyid = async function (req, res) {
    try {
        let bookId = req.params.bookId
        if (!bookId) {
            res.status(400).send({ status: false, msg: "bookId is required" })
        }
        let bookDetails = await bookModel.findOne({ _id: bookId }, { isDeleted: false })
        if (!bookDetails) {
            res.status(404).send({ status: false, msg: "book not exist" })
        } else {
            let deleteBooks = await bookModel.findOneAndUpdate({ _id: bookId }, { $set: { isDeleted: true, deletedAt: Date.now() } }, { new: true });
            res.status(200).send({ status: true, msg: "book deleted", data: deleteBooks });
            console.log(bookDetails)
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ status: false, msg: error.message })
    }
}

module.exports.bookCreate = bookCreate
module.exports.getBook = getBook
module.exports.getBookbyId = getBookbyId
module.exports.updateBooksbyId = updateBooksbyId
module.exports.deletebyid = deletebyid


