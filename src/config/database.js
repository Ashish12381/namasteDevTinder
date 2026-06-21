const mongoose = require('mongoose');
const connectDB=async()=>{
    await mongoose.connect("mongodb+srv://apal74180_db_user:ZGB2ngtXBckILU2J@namaste-node.kvwg1tb.mongodb.net/devTinder")
}

module.exports=connectDB;