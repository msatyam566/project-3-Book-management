const validator = require('validator');
const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({

    title: {
        type: String,
        enum: ["Mr", "Mrs", "Miss"],
        required: true
    },
    name: { type: String, required: true },

    phone: {type : String, required: true, unique: true,match : [/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/, 'please provide valid mobile number']
},

    email:  { type : String, required:true, unique:true
        
         },

         password:{  type: String, required: true, match:[/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, 'Min length shd be 8 and max length shd be 15']

        },


    address: {
        street : {type: String},
        city : {type: String},
        pincode: {type: String},

    }




}, { timestamps: true })



module.exports = mongoose.model('User', userSchema)