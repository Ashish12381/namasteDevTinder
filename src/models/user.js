const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken");
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 4,
    trim: true,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email format"+value);
      }
    }

  },
  password: {
    type: String,
    required: true,
    validate(value) {
        if(!validator.isStrongPassword(value, { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })) {
            throw new Error("Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol."+value);
        }
    }
  },
  age: {
    type: Number,
    min: 18,
  },
  gender: {
  type: String,
  validate(value) {
    if (!["male", "female", "other"].includes(value)) {
      throw new Error(
        "Invalid gender value. Allowed values are 'male', 'female', 'other'."
      );
    }
  }
},
isPremium: {
  type: Boolean,
  default: false,
},
membershipType: {
  type: String,
  enum: ["gold", "platinum"],
  default: null,
},
  skills:{
    type:[String],
  },
  about:{
    type:String,
    default:"Give a brief description about yourself"
  },
 photoUrl:{
  type:String,
  default:"https://picsum.photos/300",
  validate(value){
    if(!validator.isURL(value)){
      throw new Error("Invalid Photo Url");
    }
  }
}
},{
    timestamps:true
});
userSchema.methods.ValidatePassword=async function(passwordEnteredByUser){
   const user=this;
   const passwordHash=user.password;
   const isPasswordValid=await bcrypt.compare(passwordEnteredByUser,passwordHash);
   return isPasswordValid;
}
userSchema.methods.getJWT=async function(){
  const user=this;
  const token=jwt.sign({userId:user._id.toString()},"devtinder@ashish");
  return token;
}

module.exports = mongoose.model("User", userSchema);
