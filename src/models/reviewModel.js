const mongoose = require('mongoose')
const objectId = mongoose.Schema.Types.objectId


const reviewSchema = new mongoose.Schema({
    bookId :{
        required: true,
        type : objectId,
        ref : "bookModel"
    },
    reviewedBy:{
        type : String,
        required: true,


    },
    reviewedAt:{
        type : Date,
       default: date.now

    },
    rating:{
        type:Number,
        required: true

    },
    review:{
        type: String,

    },
    isDeleted: {
        type : Boolean,
        default: false
    }
})