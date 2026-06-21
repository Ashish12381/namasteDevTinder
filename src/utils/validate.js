const validator = require("validator");
const validateSignupData = (req) => {
  const { firstName, lastName, emailId, password, name } = req.body;
  if (!firstName || !lastName || !emailId || !password) {
    throw new Error("All fields are required");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid email format");
  } else if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    })
  ) {
    throw new Error(
      "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol." +
        Error.message,
    );
  }
};
const validateProfileEdit = (data) => {
  if (!data || Object.keys(data).length === 0) {
    throw new Error("No fields provided for update");
  }
  const allowed = [
    "age",
    "gender",
    "skills",
    "about",
  ];
  Object.keys(data).forEach((key) => {
    if (!allowed.includes(key)) {
      throw new Error(`Invalid field: ${key}`);
    }
    const val = data[key];
    
   
  
    if (key === "age" && (typeof val !== "number" || val < 18)) {
      throw new Error("Age must be a number and at least 18");
    }
    if (key === "gender" && !["male", "female", "other"].includes(val)) {
      throw new Error("Invalid gender value");
    }
    if (key === "skills" && !Array.isArray(val)) {
      throw new Error("Skills must be an array");
    }
    if (key === "about" && typeof val === "string" && val.length > 300) {
      throw new Error("About is too large");
    }
  });
};
const validatePassword = (data) => {
  const password = typeof data === "string" ? data : data && data.password;
  if (!password) {
    throw new Error("Password is required");
  }
  const ok = validator.isStrongPassword(password, {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  });
  if (!ok) {
    throw new Error(
      "Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one symbol."
    );
  }
  return true;
};

module.exports = { validateSignupData, validateProfileEdit, validatePassword };
