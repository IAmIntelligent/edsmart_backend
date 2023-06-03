const mongoose = require("mongoose")

const navbarLinkSchema = new mongoose.Schema({
    title: {
        type:String ,
        required: true
    },
    url:{
        type: String,
        required:true
    },
    image: {
    type: String, // Assuming the image will be stored as a URL
    required: true,
},
    text: {
    type: String,
    required: true,
}
})
module.exports =  mongoose.mongo.model("NavbarLik",navbarLinkSchema)